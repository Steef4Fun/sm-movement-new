"use client";

import { useEffect, useState, useCallback, Fragment } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Appointment = {
  id: string;
  service_type: string;
  requested_date: string;
  status: string;
  notes: string | null;
};

export default function AccountAfsprakenPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [openAppointmentId, setOpenAppointmentId] = useState<string | null>(null);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("requested_date", { ascending: true });

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

  const toggleAppointment = (id: string) => {
    setOpenAppointmentId(openAppointmentId === id ? null : id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mijn Afspraken</CardTitle>
        <CardDescription>
          Hier vindt u een overzicht van uw afspraken. Klik op een rij voor de opmerkingen.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Datum</TableHead>
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
                <Fragment key={appointment.id}>
                  <TableRow
                    onClick={() => toggleAppointment(appointment.id)}
                    className={cn(
                      "cursor-pointer",
                      appointment.status === "geannuleerd" &&
                        "text-muted-foreground line-through"
                    )}
                  >
                    <TableCell>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          openAppointmentId === appointment.id && "rotate-180"
                        )}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <span>{appointment.service_type}</span>
                        {appointment.status === "geannuleerd" && (
                          <Badge variant="destructive">Geannuleerd</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(appointment.requested_date).toLocaleString(
                        "nl-NL",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </TableCell>
                  </TableRow>
                  {openAppointmentId === appointment.id && (
                    <TableRow>
                      <TableCell colSpan={3} className="p-0">
                        <div className="p-4 bg-muted/50">
                          <h4 className="font-semibold mb-2">Opmerkingen</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {appointment.notes || "Geen opmerkingen beschikbaar."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
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