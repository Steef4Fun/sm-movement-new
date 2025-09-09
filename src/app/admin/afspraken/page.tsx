"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import * as api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  PlusCircle,
  MoreHorizontal,
  Trash2,
  Pencil,
  Search,
  Calendar as CalendarIcon,
  X,
} from "lucide-react";
import { AddAppointmentDialog } from "@/components/admin/AddAppointmentDialog";
import { EditAppointmentDialog } from "@/components/admin/EditAppointmentDialog";
import { toast } from "sonner";
import { isSameDay, format } from "date-fns";
import { nl } from "date-fns/locale";
import { TableRowSkeleton } from "@/components/skeletons/TableRowSkeleton";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  user_id: string;
  service_type: string;
  requested_date: string;
  status: string;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
};

export default function AfspraakBeheerPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const [appointmentsData, usersData] = await Promise.all([
        api.getAppointments(),
        api.getAllUsers(),
      ]);

      const usersById = usersData.reduce((acc: any, user: any) => {
        acc[user.id] = user;
        return acc;
      }, {});

      const appointmentsWithUsers = appointmentsData.map((app: any) => ({
        ...app,
        user: usersById[app.user_id] || null,
      }));

      setAppointments(appointmentsWithUsers);
    } catch (error) {
      toast.error("Kon afspraken niet ophalen.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    if (selectedDate) {
      filtered = filtered.filter((appointment) =>
        isSameDay(new Date(appointment.requested_date), selectedDate)
      );
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((appointment) => {
        const user = appointment.user;
        if (!user) return false;
        const fullName =
          `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
        return (
          fullName.includes(query) || user.email.toLowerCase().includes(query)
        );
      });
    }

    filtered.sort(
      (a, b) =>
        new Date(b.requested_date).getTime() -
        new Date(a.requested_date).getTime()
    );

    return filtered;
  }, [appointments, selectedDate, searchQuery]);

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedAppointment) return;
    try {
      await api.deleteAppointment(selectedAppointment.id);
      toast.success("Afspraak succesvol verwijderd.");
      fetchAppointments();
    } catch (error) {
      // Error is handled by the API client
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedAppointment(null);
    }
  };

  return (
    <>
      <AddAppointmentDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onAppointmentAdded={fetchAppointments}
        initialDate={selectedDate}
      />
      {selectedAppointment && (
        <EditAppointmentDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          onAppointmentUpdated={fetchAppointments}
          appointment={selectedAppointment}
        />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal de afspraak
              permanent verwijderen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Afsprakenbeheer</CardTitle>
              <CardDescription>
                Beheer, filter en plan hier alle afspraken.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nieuwe Afspraak
            </Button>
          </div>
          <div className="flex items-center gap-2 pt-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoek op klant..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] justify-start text-left font-normal",
                    !selectedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? (
                    format(selectedDate, "PPP", { locale: nl })
                  ) : (
                    <span>Filter op datum</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  locale={nl}
                  captionLayout="dropdown" // Added this line
                />
              </PopoverContent>
            </Popover>
            {selectedDate && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedDate(undefined)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Klant</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Datum & Tijd</TableHead>
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={4} />
                ))
              ) : filteredAppointments.length > 0 ? (
                filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {appointment.user ? (
                        <Link
                          href={`/admin/gebruikers/${appointment.user.id}`}
                          className="hover:underline font-medium"
                        >
                          {appointment.user?.first_name || "Onbekende"}{" "}
                          {appointment.user?.last_name || "Klant"}
                        </Link>
                      ) : (
                        "Onbekende Klant"
                      )}
                    </TableCell>
                    <TableCell>{appointment.service_type}</TableCell>
                    <TableCell>
                      {new Date(appointment.requested_date).toLocaleString(
                        "nl-NL",
                        { dateStyle: "medium", timeStyle: "short" }
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(appointment)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(appointment)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10">
                    Geen afspraken gevonden voor de geselecteerde filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}