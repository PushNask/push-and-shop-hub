import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProductStatusRequest {
  productId: string;
  status: "approved" | "rejected";
  feedback?: string;
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const handler = async (req: Request): Promise<Response> => {
  console.log("Product status notification function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, status, feedback } = await req.json() as ProductStatusRequest;

    // Get product and seller details
    const { data: product, error: productError } = await supabase
      .from("products")
      .select(`
        title,
        seller_id,
        profiles (
          email
        )
      `)
      .eq("id", productId)
      .single();

    if (productError) throw productError;
    if (!product) throw new Error("Product not found");

    const sellerEmail = product.profiles.email;
    const statusText = status === "approved" ? "approved" : "rejected";
    const feedbackText = feedback ? `\n\nFeedback: ${feedback}` : "";

    // Send email using Resend
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PushNshop <notifications@pushnshop.com>",
        to: [sellerEmail],
        subject: `Your product listing has been ${statusText}`,
        html: `
          <h2>Product Status Update</h2>
          <p>Your product "${product.title}" has been ${statusText}.</p>
          ${feedbackText}
          <p>Thank you for using PushNshop!</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      throw new Error(`Failed to send email: ${await emailResponse.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in product-status-notification:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);