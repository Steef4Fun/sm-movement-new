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
import { AddListingDialog } from "@/components/dashboard/AddListingDialog";

// Define a type for the listing for type safety
type Listing = {
  id: string;
  name: string;
  type: string;
  price: number;
  status: string;
  created_at: string;
};

export default function AanbodBeheerPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("listings").select("*").order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
    } else if (data) {
      setListings(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <>
      <AddListingDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onListingAdded={fetchListings}
      />
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Aanbodbeheer</CardTitle>
              <CardDescription>
                Beheer hier het aanbod van auto's en boten.
              </CardDescription>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Nieuw Aanbod
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Naam</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prijs</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aangemaakt op</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Laden...
                  </TableCell>
                </TableRow>
              ) : listings.length > 0 ? (
                listings.map((listing) => (
                  <TableRow key={listing.id}>
                    <TableCell className="font-medium">{listing.name}</TableCell>
                    <TableCell>{listing.type}</TableCell>
                    <TableCell>
                      {new Intl.NumberFormat("nl-NL", {
                        style: "currency",
                        currency: "EUR",
                      }).format(listing.price)}
                    </TableCell>
                    <TableCell>{listing.status}</TableCell>
                    <TableCell>
                      {new Date(listing.created_at).toLocaleDateString("nl-NL")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Geen aanbod gevonden.
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