// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      // @ts-ignore
      Deno.env.get("SUPABASE_URL")!,
      // @ts-ignore
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const authHeader = req.headers.get("Authorization")!;
    const { data: { user: adminUser } } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (!adminUser) throw new Error("Unauthorized");

    const { data: adminProfile } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", adminUser.id)
      .single();
    if (adminProfile?.role !== 'admin') throw new Error("Forbidden");

    const { customer_email, subject, amount } = await req.json();
    if (!customer_email || !subject || !amount) throw new Error("Missing required fields");

    const { data: customerData, error: customerError } = await supabaseAdmin.auth.admin.getUserByEmail(customer_email);
    if (customerError || !customerData.user) throw new Error("Customer not found");
    
    const customerId = customerData.user.id;

    const { data: quote, error: insertError } = await supabaseAdmin
      .from("offertes")
      .insert({ user_id: customerId, subject, amount })
      .select()
      .single();

    if (insertError) throw insertError;

    return new Response(JSON.stringify(quote), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});