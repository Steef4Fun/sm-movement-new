"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as api from "@/lib/api";
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
import { Textarea } from "@/components/ui/textarea";

const quoteSchema = z.object({
  customer_email: z.string().email("Voer een geldig e-mailadres in."),
  subject: z.string().min(3, "Onderwerp is te kort."),
  amount: z.coerce.number().positive("Bedrag moet een positief getal zijn."),
  description: z.string().optional(),
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
      description: "",
    },
  });

  const onSubmit = async (values: QuoteFormValues) => {
    try {
      await api.createQuote(values);
      toast.success("Offerte succesvol aangemaakt!");
      onQuoteAdded();
      setIsOpen(false);
      form.reset();
    } catch (error) {
      // Error is handled by the API client
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Omschrijving</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Voer hier de details van de offerte in..."
                      className="min-h-[100px]"
                      {...field}
                    />
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