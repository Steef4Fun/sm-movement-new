"use client";

import { useEffect, useState, useCallback } from "react";
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
import { AddQuoteDialog } from "@/components/admin/AddQuoteDialog";

type Quote = {
  id: string;
  subject: string;
  amount: number;
  status: string;
  created_at: string;
  profiles: { first_name: string | null; last_name: string | null } | null;
};

export default function OfferteBeheerPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("offertes")
      .select("*, profiles(first_name, last_name)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
    } else if (data) {
      setQuotes(data as Quote[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  return (
    <>
      <AddQuoteDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onQuoteAdded={fetchQuotes}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Offertebeheer</CardTitle>
              <CardDescription>
                Beheer hier alle offertes.
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nieuwe Offerte
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Klant</TableHead>
                <TableHead>Onderwerp</TableHead>
                <TableHead>Bedrag</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Laden...
                  </TableCell>
                </TableRow>
              ) : quotes.length > 0 ? (
                quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      {quote.profiles?.first_name || "Onbekende"}{" "}
                      {quote.profiles?.last_name || "Klant"}
                    </TableCell>
                    <TableCell className="font-medium">{quote.subject}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(quote.amount)}
                    </TableCell>
                    <TableCell>{quote.status}</TableCell>
                    <TableCell>
                      {new Date(quote.created_at).toLocaleDateString("nl-NL")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Geen offertes gevonden.
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