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
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().positive("Bouwjaar moet een positief getal zijn.").optional().or(z.literal('')),
  mileage: z.coerce.number().int().positive("Kilometerstand moet een positief getal zijn.").optional().or(z.literal('')),
  sailing_hours: z.coerce.number().int().positive("Vaaruren moeten een positief getal zijn.").optional().or(z.literal('')),
  price: z.coerce.number().positive("Prijs moet een positief getal zijn."),
  description: z.string().optional(),
  condition: z.enum(["nieuw", "gebruikt"]).default("gebruikt"),
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
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      name: "",
      description: "",
      brand: "",
      model: "",
      condition: "gebruikt",
    },
  });

  const watchedType = form.watch("type");

  const onSubmit = async (values: ListingFormValues) => {
    try {
      const payload = {
        ...values,
        year: values.year || null,
        mileage: values.mileage || null,
        sailing_hours: values.sailing_hours || null,
      };
      await api.createListing(payload);
      toast.success("Aanbod succesvol toegevoegd!");
      onListingAdded();
      setIsOpen(false);
      form.reset();
    } catch (error) {
      // Error toast handled by api client
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Nieuw Aanbod Toevoegen</DialogTitle>
          <DialogDescription>
            Voer de details in van het nieuwe item.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Selecteer een type" /></SelectTrigger>
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
                    <FormControl><Input placeholder="Bijv. Audi RS6" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Merk</FormLabel>
                    <FormControl><Input placeholder="Bijv. Audi" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl><Input placeholder="Bijv. RS6" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bouwjaar</FormLabel>
                    <FormControl><Input type="number" placeholder="Bijv. 2023" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchedType === "Auto" && (
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kilometerstand</FormLabel>
                      <FormControl><Input type="number" placeholder="Bijv. 50000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {watchedType === "Boot" && (
                 <FormField
                  control={form.control}
                  name="sailing_hours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vaaruren</FormLabel>
                      <FormControl><Input type="number" placeholder="Bijv. 120" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prijs</FormLabel>
                    <FormControl><Input type="number" placeholder="Bijv. 150000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Conditie</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nieuw">Nieuw</SelectItem>
                        <SelectItem value="gebruikt">Gebruikt</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Omschrijving</FormLabel>
                  <FormControl><Textarea placeholder="Voer een korte omschrijving in..." {...field} /></FormControl>
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