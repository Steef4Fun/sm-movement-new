"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

type Appointment = {
  id: string;
  service_type: string;
  requested_date: string;
  status: string;
};

export default function AfspraakBeheerPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("appointments").select("*");

      if (error) {
        console.error("Error fetching appointments:", error);
      } else if (data) {
        setAppointments(data);
      }
      setLoading(false);
    };

    fetchAppointments();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Mijn Afspraken</CardTitle>
            <CardDescription>
              Bekijk en beheer hier uw afspraken.
            </CardDescription>
          </div>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nieuwe Afspraak
          </Button>
        </div>
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
                    {new Date(appointment.requested_date).toLocaleString("nl-NL")}
                  </TableCell>
                  <TableCell>{appointment.status}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  Geen afspraken gevonden.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}