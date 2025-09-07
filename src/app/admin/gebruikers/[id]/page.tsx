"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import * as api from "@/lib/api";
import {
  Card,
  CardContent,
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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MoreHorizontal, Pencil } from "lucide-react";
import { EditAppointmentDialog } from "@/components/admin/EditAppointmentDialog";
import { EditQuoteDialog } from "@/components/admin/EditQuoteDialog";
import { StatusBadge } from "@/components/admin/StatusBadge";

type User = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: string;
};
type Appointment = any;
type Quote = any;

export default function GebruikerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const [isEditAppointmentDialogOpen, setIsEditAppointmentDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isEditQuoteDialogOpen, setIsEditQuoteDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const userData = await api.getUserById(id);
      setUser(userData);

      if (userData) {
        const allAppointments = await api.getAppointments();
        setAppointments(allAppointments.filter((app: any) => app.user_id === userData.id));

        const allQuotes = await api.getQuotes();
        setQuotes(allQuotes.filter((quote: any) => quote.user_id === userData.id));
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsEditAppointmentDialogOpen(true);
  };

  const handleEditQuote = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsEditQuoteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <div>Gebruiker niet gevonden.</div>;
  }

  return (
    <>
      {selectedAppointment && (
        <EditAppointmentDialog
          isOpen={isEditAppointmentDialogOpen}
          setIsOpen={setIsEditAppointmentDialogOpen}
          onAppointmentUpdated={fetchData}
          appointment={selectedAppointment}
        />
      )}
      {selectedQuote && (
        <EditQuoteDialog
          isOpen={isEditQuoteDialogOpen}
          setIsOpen={setIsEditQuoteDialogOpen}
          onQuoteUpdated={fetchData}
          quote={selectedQuote}
        />
      )}

      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Terug naar overzicht
        </Button>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Klantprofiel</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p><strong>Naam:</strong> {user.first_name} {user.last_name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Rol:</strong> {user.role}</p>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recente Afspraken</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Datum</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments.length > 0 ? (
                    appointments.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell>{app.service_type}</TableCell>
                        <TableCell>{new Date(app.requested_date).toLocaleDateString('nl-NL')}</TableCell>
                        <TableCell><StatusBadge status={app.status} /></TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditAppointment(app)}>
                                <Pencil className="mr-2 h-4 w-4" /> Bewerken
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">Geen afspraken.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recente Offertes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Onderwerp</TableHead>
                  <TableHead>Bedrag</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Datum</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.length > 0 ? (
                  quotes.map((quote) => (
                    <TableRow key={quote.id}>
                      <TableCell>{quote.subject}</TableCell>
                      <TableCell>{new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(quote.amount)}</TableCell>
                      <TableCell><StatusBadge status={quote.status} /></TableCell>
                      <TableCell>{new Date(quote.created_at).toLocaleDateString('nl-NL')}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEditQuote(quote)}>
                              <Pencil className="mr-2 h-4 w-4" /> Bewerken
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">Geen offertes.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}