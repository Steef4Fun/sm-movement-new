// @ts-ignore
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// @ts-ignore
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define types for clarity
interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
}

interface AuthUser {
  id: string;
  email?: string;
}

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

    // Authenticate and authorize the admin caller (safer method)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (authError || !authData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const user = authData.user;

    const { data: adminProfile, error: adminError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (adminError || adminProfile?.role !== "admin") {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Haal alle gebruikers op uit de authenticatie-tabel
    const {
      data: { users },
      error: usersError,
    } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    // Haal alle profielen op
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from("profiles")
      .select("*");
    if (profilesError) throw profilesError;

    // Voeg gebruikers en profielen samen
    const profilesMap = new Map((profiles as Profile[]).map((p) => [p.id, p]));
    const mergedUsers = (users as AuthUser[]).map((u) => {
      const profile = profilesMap.get(u.id);
      return {
        id: u.id,
        email: u.email,
        first_name: profile?.first_name || "",
        last_name: profile?.last_name || "",
        role: profile?.role || "klant",
      };
    });

    return new Response(JSON.stringify(mergedUsers), {
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