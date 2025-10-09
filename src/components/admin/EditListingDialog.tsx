"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as api from "@/lib/api";
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

const listingSchema = z.object({
  type: z.enum(["Auto", "Boot"]),
  name: z.string().min(3, "Naam moet minimaal 3 karakters lang zijn."),
  brand: z.string().optional(),
  model: z.string().optional(),
  year: z.coerce.number().int().positive("Bouwjaar moet een positief getal zijn.").optional().or(z.literal('')),
  mileage: z.coerce.number().int().positive("Kilometerstand moet een positief getal zijn.").optional().or(z.literal('')),
  sailing_hours: z.coerce.number().int().positive("Vaaruren moeten een positief getal zijn.").optional().or(z.literal('')),
  price: z.coerce.number().positive("Prijs moet een positief getal zijn."),
  description: z.string().optional(),
  status: z.enum(["beschikbaar", "verkocht", "gereserveerd"]),
});

type ListingFormValues = z.infer<typeof listingSchema>;

interface EditListingDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onListingUpdated: () => void;
  listing: any;
}

export function EditListingDialog({
  isOpen,
  setIsOpen,
  onListingUpdated,
  listing,
}: EditListingDialogProps) {
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
  });

  const watchedType = form.watch("type");

  useEffect(() => {
    if (listing) {
      form.reset({
        ...listing,
        year: listing.year || '',
        mileage: listing.mileage || '',
        sailing_hours: listing.sailing_hours || '',
      });
    }
  }, [listing, form]);

  const onSubmit = async (values: ListingFormValues) => {
    try {
      const payload = {
        ...values,
        year: values.year || null,
        mileage: values.mileage || null,
        sailing_hours: values.sailing_hours || null,
      };
      await api.updateListing(listing.id, payload);
      toast.success("Aanbod succesvol bijgewerkt!");
      onListingUpdated();
      setIsOpen(false);
    } catch (error) {
      // Error is handled by the API client
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Aanbod Bewerken</DialogTitle>
          <DialogDescription>
            Pas de details van het item aan.
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
                      <Input {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
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
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
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
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
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
                        <SelectItem value="beschikbaar">Beschikbaar</SelectItem>
                        <SelectItem value="verkocht">Verkocht</SelectItem>
                        <SelectItem value="gereserveerd">Gereserveerd</SelectItem>
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
                  <FormControl>
                    <Textarea {...field} />
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