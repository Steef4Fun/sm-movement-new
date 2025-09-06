"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const quoteSchema = z.object({
  subject: z.string().min(3, "Onderwerp is te kort."),
  amount: z.coerce.number().positive("Bedrag moet een positief getal zijn."),
  status: z.enum(["in afwachting", "geaccepteerd", "geweigerd"]),
  description: z.string().optional(),
});

type QuoteFormValues = z.infer<typeof quoteSchema>;

interface EditQuoteDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onQuoteUpdated: () => void;
  quote: any;
}

export function EditQuoteDialog({
  isOpen,
  setIsOpen,
  onQuoteUpdated,
  quote,
}: EditQuoteDialogProps) {
  const form = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
  });

  useEffect(() => {
    if (quote) {
      form.reset(quote);
    }
  }, [quote, form]);

  const onSubmit = async (values: QuoteFormValues) => {
    const { error } = await supabase
      .from("offertes")
      .update(values)
      .eq("id", quote.id);

    if (error) {
      toast.error(`Fout bij bijwerken offerte: ${error.message}`);
    } else {
      toast.success("Offerte succesvol bijgewerkt!");
      onQuoteUpdated();
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Offerte Bewerken</DialogTitle>
          <DialogDescription>
            Pas de details van de offerte aan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Onderwerp</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="in afwachting">In afwachting</SelectItem>
                      <SelectItem value="geaccepteerd">Geaccepteerd</SelectItem>
                      <SelectItem value="geweigerd">Geweigerd</SelectItem>
                    </SelectContent>
                  </Select>
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
                {form.formState.isSubmitting ? "Opslaan..." : "Opslaan"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}