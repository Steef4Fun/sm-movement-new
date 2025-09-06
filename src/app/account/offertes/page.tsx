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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Quote = {
  id: string;
  subject: string;
  amount: number;
  status: string;
  created_at: string;
};

export default function AccountOffertesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("offertes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching quotes:", error);
      toast.error("Kon offertes niet ophalen.");
    } else if (data) {
      setQuotes(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleStatusUpdate = async (quoteId: string, newStatus: "geaccepteerd" | "geweigerd") => {
    const { error } = await supabase
      .from("offertes")
      .update({ status: newStatus })
      .eq("id", quoteId);

    if (error) {
      toast.error(`Fout bij bijwerken status: ${error.message}`);
    } else {
      toast.success(`Offerte ${newStatus}.`);
      fetchQuotes();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mijn Offertes</CardTitle>
        <CardDescription>
          Hier vindt u een overzicht van uw offertes.
        </CardDescription>
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
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Laden...
                </TableCell>
              </TableRow>
            ) : quotes.length > 0 ? (
              quotes.map((quote) => (
                <TableRow key={quote.id}>
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
                  <TableCell className="text-right">
                    {quote.status === 'in afwachting' && (
                      <div className="flex gap-2 justify-end">
                        <Button size="sm" onClick={() => handleStatusUpdate(quote.id, 'geaccepteerd')}>
                          Accepteren
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(quote.id, 'geweigerd')}>
                          Weigeren
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  U heeft nog geen offertes.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}