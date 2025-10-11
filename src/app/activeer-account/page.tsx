"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

const activationSchema = z.object({
  first_name: z.string().min(1, "Voornaam is verplicht."),
  last_name: z.string().min(1, "Achternaam is verplicht."),
  password: z.string().min(6, "Wachtwoord moet minimaal 6 karakters lang zijn."),
});

type ActivationFormValues = z.infer<typeof activationSchema>;

function ActivationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<ActivationFormValues>({
    resolver: zodResolver(activationSchema),
    defaultValues: { first_name: "", last_name: "", password: "" },
  });

  const onSubmit = async (values: ActivationFormValues) => {
    if (!token) {
      toast.error("Geen activatie token gevonden.");
      return;
    }

    try {
      const response = await fetch('/api/auth/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Er is iets misgegaan.");
      }

      toast.success("Account succesvol geactiveerd! U kunt nu inloggen.");
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (!token) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Fout</CardTitle>
          <CardDescription>De activatielink is ongeldig of ontbreekt.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Activeer uw Account</CardTitle>
        <CardDescription>
          Vul uw gegevens in en kies een wachtwoord om uw account te activeren.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="first_name" render={({ field }) => ( <FormItem> <Label>Voornaam</Label> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
              <FormField control={form.control} name="last_name" render={({ field }) => ( <FormItem> <Label>Achternaam</Label> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            </div>
            <FormField control={form.control} name="password" render={({ field }) => ( <FormItem> <Label>Wachtwoord</Label> <FormControl><Input type="password" {...field} /></FormControl> <FormMessage /> </FormItem> )}/>
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Activeren..." : "Account Activeren"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ActivateAccountPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow flex items-center justify-center p-4">
        <Suspense fallback={<div>Laden...</div>}>
          <ActivationForm />
        </Suspense>
      </main>
    </div>
  );
}