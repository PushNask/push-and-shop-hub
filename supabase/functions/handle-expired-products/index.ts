import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const handler = async (req: Request): Promise<Response> => {
  console.log("Handle expired products function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get expired products
    const { data: expiredProducts, error: expiredError } = await supabase
      .from("products")
      .select("id, link_slot")
      .eq("status", "approved")
      .lt("expiry", new Date().toISOString());

    if (expiredError) throw expiredError;

    // Get next products in queue
    const { data: queuedProducts, error: queuedError } = await supabase
      .from("products")
      .select("id")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(expiredProducts?.length || 0);

    if (queuedError) throw queuedError;

    // Update expired products
    for (const product of expiredProducts || []) {
      const { error: updateError } = await supabase
        .from("products")
        .update({ status: "expired" })
        .eq("id", product.id);

      if (updateError) throw updateError;
    }

    // Assign slots to queued products
    for (let i = 0; i < (queuedProducts?.length || 0); i++) {
      if (expiredProducts && expiredProducts[i]) {
        const { error: updateError } = await supabase
          .from("products")
          .update({
            status: "approved",
            link_slot: expiredProducts[i].link_slot,
            expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          })
          .eq("id", queuedProducts[i].id);

        if (updateError) throw updateError;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: expiredProducts?.length || 0,
        replaced: queuedProducts?.length || 0,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in handle-expired-products:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);