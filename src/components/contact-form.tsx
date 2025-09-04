"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Naam moet minimaal 2 karakters bevatten.",
  }),
  email: z.string().email({
    message: "Voer een geldig e-mailadres in.",
  }),
  subject: z.string().min(5, {
    message: "Onderwerp moet minimaal 5 karakters bevatten.",
  }),
  message: z.string().min(10, {
    message: "Bericht moet minimaal 10 karakters bevatten.",
  }),
});

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you'd handle form submission here (e.g., send an email, API call)
    console.log(values);
    toast.success("Bericht verzonden!", {
      description: "We nemen zo snel mogelijk contact met u op.",
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Naam</FormLabel>
              <FormControl>
                <Input placeholder="Uw naam" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mailadres</FormLabel>
              <FormControl>
                <Input placeholder="voorbeeld@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </Item>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Onderwerp</FormLabel>
              <FormControl>
                <Input placeholder="Waar gaat uw bericht over?" {...field} />
              </FormControl>
              <FormMessage />
            </Item>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bericht</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Laat hier uw bericht achter..."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </Item>
          )}
        />
        <Button type="submit" className="w-full">
          Verstuur Bericht
        </Button>
      </form>
    </Form>
  );
}