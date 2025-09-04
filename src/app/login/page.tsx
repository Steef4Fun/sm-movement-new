"use client";

import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { createClient } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push("/"); // Redirect to home after login
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase, router]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center">
        <div className="w-full max-w-md p-8 space-y-8">
          <div>
            <h1 className="text-center text-3xl font-extrabold tracking-tight text-primary">
              Inloggen
            </h1>
          </div>
          <Auth
            supabaseClient={supabase}
            appearance={{ theme: ThemeSupa }}
            providers={[]}
            theme="dark"
            localization={{
              variables: {
                sign_in: {
                  email_label: "E-mailadres",
                  password_label: "Wachtwoord",
                  button_label: "Inloggen",
                  social_provider_text: "Inloggen met {{provider}}",
                  link_text: "Heeft u al een account? Log in",
                },
                sign_up: {
                  email_label: "E-mailadres",
                  password_label: "Wachtwoord",
                  button_label: "Registreren",
                  social_provider_text: "Registreren met {{provider}}",
                  link_text: "Nog geen account? Registreer",
                },
                forgotten_password: {
                  email_label: "E-mailadres",
                  password_label: "Wachtwoord",
                  button_label: "Verstuur instructies",
                  link_text: "Wachtwoord vergeten?",
                },
              },
            }}
          />
        </div>
      </main>
    </div>
  );
}