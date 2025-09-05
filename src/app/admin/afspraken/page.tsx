"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
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
import { PlusCircle } from "lucide-react";
import { AddAppointmentDialog } from "@/components/admin/AddAppointmentDialog";

type Appointment = {
  id: string;
  service_type: string;
  requested_date: string;
  status: string;
  profiles: { first_name: string | null; last_name: string | null } | null;
};

export default function AfspraakBeheerPage() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*, profiles(first_name, last_name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching appointments:", error);
    } else if (data) {
      setAppointments(data as Appointment[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const isAdmin = profile?.role === "admin";

  return (
    <>
      <AddAppointmentDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAppointmentAdded={fetchAppointments}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>
                {isAdmin ? "Afsprakenbeheer" : "Mijn Afspraken"}
              </CardTitle>
              <CardDescription>
                {isAdmin
                  ? "Bekijk en beheer hier alle afspraken."
                  : "Bekijk hier uw afspraken."}
              </CardDescription>
            </div>
            {isAdmin && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Nieuwe Afspraak
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                {isAdmin && <TableHead>Klant</TableHead>}
                <TableHead>Service</TableHead>
                <TableHead>Aangevraagde Datum</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 4 : 3} className="text-center">
                    Laden...
                  </TableCell>
                </TableRow>
              ) : appointments.length > 0 ? (
                appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    {isAdmin && (
                      <TableCell>
                        {appointment.profiles?.first_name || "Onbekende"}{" "}
                        {appointment.profiles?.last_name || "Klant"}
                      </TableCell>
                    )}
                    <TableCell className="font-medium">
                      {appointment.service_type}
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.requested_date).toLocaleString(
                        "nl-NL"
                      )}
                    </TableCell>
                    <TableCell>{appointment.status}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={isAdmin ? 4 : 3} className="text-center">
                    Geen afspraken gevonden.
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