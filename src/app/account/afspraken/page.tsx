"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
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

type Appointment = {
  id: string;
  service_type: string;
  requested_date: string;
  status: string;
};

export default function AccountAfsprakenPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching appointments:", error);
    } else if (data) {
      setAppointments(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mijn Afspraken</CardTitle>
        <CardDescription>
          Hier vindt u een overzicht van al uw geplande afspraken.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Aangevraagde Datum</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Laden...
                </TableCell>
              </TableRow>
            ) : appointments.length > 0 ? (
              appointments.map((appointment) => (
                <TableRow key={appointment.id}>
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
                <TableCell colSpan={3} className="text-center">
                  U heeft nog geen afspraken.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}