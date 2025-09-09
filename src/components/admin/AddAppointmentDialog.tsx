"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as api from "@/lib/api";
import { toast } from "sonner";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import { nl } from "date-fns/locale";
import { cn } from "@/lib/utils";
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
import { DatePickerInput } from "@/components/DatePickerInput"; // Import the new component

const appointmentSchema = z.object({
  customer_email: z.string().email("Voer een geldig e-mailadres in."),
  service_type: z.enum(["Detailing", "Tuning", "Consultatie"], {
    required_error: "Service type is verplicht.",
  }),
  requested_date: z.date({
    required_error: "Een datum is verplicht.",
  }),
  time: z.string({ required_error: "Een tijd is verplicht." }),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface AddAppointmentDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAppointmentAdded: () => void;
  initialDate?: Date;
}

export function AddAppointmentDialog({
  isOpen,
  setIsOpen,
  onAppointmentAdded,
  initialDate,
}: AddAppointmentDialogProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      customer_email: "",
      notes: "",
      time: "10:00",
    },
  });

  useEffect(() => {
    if (initialDate) {
      form.setValue("requested_date", initialDate);
    }
  }, [initialDate, form]);

  const onSubmit = async (values: AppointmentFormValues) => {
    const [hours, minutes] = values.time.split(":").map(Number);
    const combinedDateTime = setSeconds(setMinutes(setHours(values.requested_date, hours), minutes), 0);

    try {
      await api.createAppointment({
        ...values,
        requested_date: combinedDateTime.toISOString(),
      });
      toast.success("Afspraak succesvol aangemaakt!");
      onAppointmentAdded();
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
          <DialogTitle>Nieuwe Afspraak Inplannen</DialogTitle>
          <DialogDescription>
            Plan een afspraak in voor een klant.
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
              name="service_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Detailing">Detailing</SelectItem>
                      <SelectItem value="Tuning">Tuning</SelectItem>
                      <SelectItem value="Consultatie">Consultatie</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="requested_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Datum</FormLabel>
                    <FormControl>
                      <DatePickerInput
                        selected={field.value}
                        onChange={field.onChange}
                        minDate={new Date()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tijd</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opmerkingen</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Eventuele extra informatie..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Inplannen..." : "Inplannen"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}