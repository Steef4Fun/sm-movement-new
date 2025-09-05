"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const profileSchema = z.object({
  first_name: z.string().min(1, "Voornaam is verplicht."),
  last_name: z.string().min(1, "Achternaam is verplicht."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, profile, isLoading } = useAuth();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
      });
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update(values)
      .eq("id", user.id);

    if (error) {
      toast.error(`Fout bij het bijwerken van profiel: ${error.message}`);
    } else {
      toast.success("Profiel succesvol bijgewerkt!");
    }
  };

  if (isLoading) {
    return <div>Laden...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mijn Profiel</CardTitle>
        <CardDescription>
          Beheer hier uw persoonlijke gegevens.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voornaam</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Achternaam</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Opslaan..." : "Opslaan"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}