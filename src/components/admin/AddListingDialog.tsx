"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const listingSchema = z.object({
  type: z.enum(["Auto", "Boot"], { required_error: "Type is verplicht." }),
  name: z.string().min(3, "Naam moet minimaal 3 karakters lang zijn."),
  price: z.coerce.number().positive("Prijs moet een positief getal zijn."),
  description: z.string().optional(),
});

type ListingFormValues = z.infer<typeof listingSchema>;

interface AddListingDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onListingAdded: () => void;
}

export function AddListingDialog({
  isOpen,
  setIsOpen,
  onListingAdded,
}: AddListingDialogProps) {
  const { user } = useAuth();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: ListingFormValues) => {
    if (!user) {
      toast.error("U moet ingelogd zijn om een aanbod toe te voegen.");
      return;
    }

    const { error } = await supabase.from("listings").insert([
      {
        ...values,
        user_id: user.id,
      },
    ]);

    if (error) {
      toast.error(`Er is een fout opgetreden: ${error.message}`);
    } else {
      toast.success("Aanbod succesvol toegevoegd!");
      onListingAdded();
      setIsOpen(false);
      form.reset();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nieuw Aanbod Toevoegen</DialogTitle>
          <DialogDescription>
            Voer de details in van het nieuwe item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Auto">Auto</SelectItem>
                      <SelectItem value="Boot">Boot</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Naam</FormLabel>
                  <FormControl>
                    <Input placeholder="Bijv. Audi RS6" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prijs</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Bijv. 150000" {...field} />
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
                      placeholder="Voer een korte omschrijving in..."
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