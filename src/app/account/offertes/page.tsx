"use client";

import { useEffect, useState, useCallback } from "react";
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
import { toast } from "sonner";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Link from "next/link";

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
  const [termsAccepted, setTermsAccepted] = useState(false);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getQuotes();
      setQuotes(data);
    } catch (error) {
      toast.error("Kon offertes niet ophalen.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const handleStatusUpdate = async (quoteId: string, newStatus: "geaccepteerd" | "geweigerd") => {
    try {
      await api.updateUserQuoteStatus(quoteId, newStatus);
      toast.success(`Offerte ${newStatus}.`);
      fetchQuotes();
    } catch (error) {
      // Error is handled by the API client
    }
  };

  const toggleQuote = (id: string) => {
    setOpenQuoteId(openQuoteId === id ? null : id);
  };

  return (
    <Card className="rounded-2xl shadow-lg border border-border/50">
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
                const isExpanded = openQuoteId === quote.id;
                const rows = [
                  <TableRow key={quote.id} onClick={() => toggleQuote(quote.id)} className="cursor-pointer">
                    <TableCell>
                      <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
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
                          <Button size="sm" className="rounded-full" disabled={!termsAccepted} onClick={(e) => { e.stopPropagation(); handleStatusUpdate(quote.id, 'geaccepteerd'); }}>
                            Accepteren
                          </Button>
                          <Button size="sm" variant="destructive" className="rounded-full" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(quote.id, 'geweigerd'); }}>
                            Weigeren
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ];

                if (isExpanded) {
                  rows.push(
                    <TableRow key={`${quote.id}-details`}>
                      <TableCell colSpan={6} className="p-0">
                        <div className="p-4 bg-muted/50 space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Omschrijving</h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {quote.description || "Geen omschrijving beschikbaar."}
                            </p>
                          </div>
                          {quote.status === 'in afwachting' && (
                            <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                              <Checkbox id={`terms-${quote.id}`} checked={termsAccepted} onCheckedChange={(checked) => setTermsAccepted(Boolean(checked))} />
                              <Label htmlFor={`terms-${quote.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Ik ga akkoord met de{" "}
                                <Link href="/algemene-voorwaarden" className="underline hover:text-primary" target="_blank">
                                  algemene voorwaarden
                                </Link>
                                .
                              </Label>
                            </div>
                          )}
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