"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import * as api from "@/lib/api";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { PlusCircle, MoreHorizontal, Trash2, Pencil, Search } from "lucide-react";
import { AddQuoteDialog } from "@/components/admin/AddQuoteDialog";
import { EditQuoteDialog } from "@/components/admin/EditQuoteDialog";
import { toast } from "sonner";
import { TableRowSkeleton } from "@/components/skeletons/TableRowSkeleton";

type Quote = {
  id: string;
  subject: string;
  amount: number;
  status: string;
  created_at: string;
  user: { first_name: string | null; last_name: string | null; email: string; } | null;
};

export default function OfferteBeheerPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getQuotes();
      setQuotes(data);
    } catch (error) {
      // Error is handled by the API client
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [fetchQuotes]);

  const filteredQuotes = useMemo(() => {
    return quotes.filter((quote) => {
      const query = searchQuery.toLowerCase();
      if (!query) return true;
      const user = quote.user;
      if (!user) return false;
      const fullName = `${user.first_name || ""} ${user.last_name || ""}`.toLowerCase();
      return fullName.includes(query) || user.email.toLowerCase().includes(query);
    });
  }, [quotes, searchQuery]);

  const handleEdit = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (quote: Quote) => {
    setSelectedQuote(quote);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuote) return;
    try {
      await api.deleteQuote(selectedQuote.id);
      toast.success("Offerte succesvol verwijderd.");
      fetchQuotes();
    } catch (error) {
      // Error is handled by the API client
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedQuote(null);
    }
  };

  return (
    <>
      <AddQuoteDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onQuoteAdded={fetchQuotes}
      />
      {selectedQuote && (
        <EditQuoteDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          onQuoteUpdated={fetchQuotes}
          quote={selectedQuote}
        />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet u het zeker?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Dit zal de offerte
              permanent verwijderen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Offertebeheer</CardTitle>
              <CardDescription>
                Beheer hier alle offertes.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nieuwe Offerte
            </Button>
          </div>
           <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoek op naam of e-mail..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))
              ) : filteredQuotes.length > 0 ? (
                filteredQuotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell>
                      {quote.user?.first_name || "Onbekende"}{" "}
                      {quote.user?.last_name || "Klant"}
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(quote)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(quote)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Verwijderen
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
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