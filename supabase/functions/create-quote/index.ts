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

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const adminUser = authData.user;

    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", adminUser.id)
      .single();
    if (adminError || adminProfile?.role !== 'admin') {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { customer_email, subject, amount } = await req.json();
    if (!customer_email || !subject || !amount) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: customerId, error: rpcError } = await supabaseAdmin
      .rpc('get_user_id_by_email', { email_text: customer_email });

    if (rpcError || !customerId) {
      console.error("Customer lookup RPC error:", rpcError);
      return new Response(JSON.stringify({ error: "Customer not found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Ensure a profile exists for the customer
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("id", customerId)
      .single();

    if (profileError && profileError.code === 'PGRST116') { // PGRST116 = single row not found
      const { error: createProfileError } = await supabaseAdmin
        .from("profiles")
        .insert({ id: customerId });
      
      if (createProfileError) {
        console.error("Failed to create profile for user:", createProfileError);
        return new Response(JSON.stringify({ error: `Could not create profile for user: ${createProfileError.message}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    } else if (profileError) {
      console.error("Error checking for profile:", profileError);
      return new Response(JSON.stringify({ error: `Error checking profile: ${profileError.message}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const { data: quote, error: insertError } = await supabaseAdmin
      .from("offertes")
      .insert({ user_id: customerId, subject, amount })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(JSON.stringify({ error: `Failed to create quote: ${insertError.message}` }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify(quote), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});