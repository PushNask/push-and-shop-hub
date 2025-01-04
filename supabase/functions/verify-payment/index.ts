import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PaymentVerificationRequest {
  productId: string;
  verifiedBy: string;
  amount: number;
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

const handler = async (req: Request): Promise<Response> => {
  console.log("Payment verification function invoked");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, verifiedBy, amount } = await req.json() as PaymentVerificationRequest;

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

    // Update product status to approved
    const { error: updateError } = await supabase
      .from("products")
      .update({ status: "approved" })
      .eq("id", productId);

    if (updateError) throw updateError;

    // Send confirmation email to seller
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "PushNshop <notifications@pushnshop.com>",
        to: [product.profiles.email],
        subject: "Payment Verified - Your Product is Now Live",
        html: `
          <h2>Payment Verified</h2>
          <p>Your payment of ${amount} XAF for "${product.title}" has been verified.</p>
          <p>Your product listing is now live on PushNshop!</p>
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
    console.error("Error in verify-payment:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);