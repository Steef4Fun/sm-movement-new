"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const quoteSchema = z.object({
  customer_email: z.string().email("Voer een geldig e-mailadres in."),
  subject: z.string().min(3, "Onderwerp is te kort."),
  amount: z.coerce.number().positive("Bedrag moet een positief getal zijn."),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface AddQuoteDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onQuoteAdded: () => void;
}

export function AddQuoteDialog({
  isOpen,
  setIsOpen,
  onQuoteAdded,
}: AddQuoteDialogProps) {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      customer_email: "",
      subject: "",
    },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    const { data, error } = await supabase.functions.invoke(
      "create-quote",
      {
        body: values,
      }
    );

    if (error || data.error) {
      toast.error(`Fout bij aanmaken offerte: ${error?.message || data.error}`);
    } else {
      toast.success("Offerte succesvol aangemaakt!");
      onQuoteAdded();
      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nieuwe Offerte Aanmaken</DialogTitle>
          <DialogDescription>
            Maak een offerte aan voor een klant.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="customer_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mailadres Klant</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="klant@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onderwerp</FormLabel>
                  <FormControl>
                    <Input placeholder="Bijv. Detailing Pakket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bedrag (€)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Aanmaken..." : "Aanmaken"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}