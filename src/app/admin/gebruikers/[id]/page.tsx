"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import * as api from "@/lib/api";
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
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

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

  const fetchData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const userData = await api.getUserById(id);
      setUser(userData);

      // Fetch related data separately to avoid crashing the whole page
      try {
        const appointmentsData = await api.getAppointmentsByUserId(id);
        setAppointments(appointmentsData);
      } catch (e) {
        console.error("Failed to fetch appointments for user", e);
        setAppointments([]); // Set to empty array on failure
      }

      try {
        const quotesData = await api.getQuotesByUserId(id);
        setQuotes(quotesData);
      } catch (e) {
        console.error("Failed to fetch quotes for user", e);
        setQuotes([]); // Set to empty array on failure
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.length > 0 ? (
                  appointments.map((app) => (
                    <TableRow key={app.id}>
                      <TableCell>{app.service_type}</TableCell>
                      <TableCell>{new Date(app.requested_date).toLocaleDateString('nl-NL')}</TableCell>
                      <TableCell>{app.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">Geen afspraken.</TableCell>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotes.length > 0 ? (
                quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>{quote.subject}</TableCell>
                    <TableCell>{new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(quote.amount)}</TableCell>
                    <TableCell>{quote.status}</TableCell>
                    <TableCell>{new Date(quote.created_at).toLocaleDateString('nl-NL')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">Geen offertes.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}