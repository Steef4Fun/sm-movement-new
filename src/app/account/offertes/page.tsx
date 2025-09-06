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
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Quote = {
  id: string;
  subject: string;
  amount: number;
  status: string;
  created_at: string;
  description: string | null;
};

export default function AccountOffertesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [openQuoteId, setOpenQuoteId] = useState<string | null>(null);

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

  const toggleQuote = (id: string) => {
    setOpenQuoteId(openQuoteId === id ? null : id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mijn Offertes</CardTitle>
        <CardDescription>
          Hier vindt u een overzicht van uw offertes. Klik op een rij voor details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
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
                <TableCell colSpan={6} className="text-center">
                  Laden...
                </TableCell>
              </TableRow>
            ) : quotes.length > 0 ? (
              quotes.flatMap((quote) => {
                const rows = [
                  <TableRow key={quote.id} onClick={() => toggleQuote(quote.id)} className="cursor-pointer">
                    <TableCell>
                      <ChevronDown className={cn("h-4 w-4 transition-transform", openQuoteId === quote.id && "rotate-180")} />
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
                    <TableCell className="text-right">
                      {quote.status === 'in afwachting' && (
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(quote.id, 'geaccepteerd'); }}>
                            Accepteren
                          </Button>
                          <Button size="sm" variant="destructive" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(quote.id, 'geweigerd'); }}>
                            Weigeren
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ];

                if (openQuoteId === quote.id) {
                  rows.push(
                    <TableRow key={`${quote.id}-details`}>
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4 bg-muted/50">
                          <h4 className="font-semibold mb-2">Omschrijving</h4>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {quote.description || "Geen omschrijving beschikbaar."}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }
                
                return rows;
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
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