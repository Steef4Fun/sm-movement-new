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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const userSchema = z.object({
  role: z.enum(["admin", "klant"]),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onUserUpdated: () => void;
  user: any;
}

export function EditUserDialog({
  isOpen,
  setIsOpen,
  onUserUpdated,
  user,
}: EditUserDialogProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      form.reset({ role: user.role });
    }
  }, [user, form]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      await api.updateUserRole(user.id, values.role);
      toast.success("Gebruikersrol succesvol bijgewerkt!");
      onUserUpdated();
      setIsOpen(false);
    } catch (error) {
      // Error is handled by the API client
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gebruikersrol Bewerken</DialogTitle>
          <DialogDescription>
            Pas de rol van {user?.email} aan.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rol</FormLabel>
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
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="klant">Klant</SelectItem>
                    </SelectContent>
                  </Select>
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