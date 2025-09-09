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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DatePickerInput } from "@/components/DatePickerInput"; // Import the new component

const appointmentSchema = z.object({
  service_type: z.enum(["Detailing", "Tuning", "Consultatie"]),
  requested_date: z.date(),
  time: z.string(),
  notes: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

interface EditAppointmentDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAppointmentUpdated: () => void;
  appointment: any;
}

export function EditAppointmentDialog({
  isOpen,
  setIsOpen,
  onAppointmentUpdated,
  appointment,
}: EditAppointmentDialogProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (appointment) {
      const appointmentDate = new Date(appointment.requested_date);
      form.reset({
        ...appointment,
        requested_date: appointmentDate,
        time: format(appointmentDate, "HH:mm"),
      });
    }
  }, [appointment, form]);

  const onSubmit = async (values: AppointmentFormValues) => {
    const [hours, minutes] = values.time.split(":").map(Number);
    const combinedDateTime = setSeconds(setMinutes(setHours(values.requested_date, hours), minutes), 0);

    const { time, ...updateData } = values;

    try {
      await api.updateAppointment(appointment.id, {
        ...updateData,
        requested_date: combinedDateTime.toISOString(),
      });
      toast.success("Afspraak succesvol bijgewerkt!");
      onAppointmentUpdated();
      setIsOpen(false);
    } catch (error) {
      // Error is handled by the API client
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Afspraak Bewerken</DialogTitle>
          <DialogDescription>
            Pas de details van de afspraak aan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <SelectValue />
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