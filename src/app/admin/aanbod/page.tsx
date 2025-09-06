"use client";

import { useEffect, useState, useCallback } from "react";
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
import { PlusCircle, MoreHorizontal, Trash2, Pencil, Car } from "lucide-react";
import { AddListingDialog } from "@/components/admin/AddListingDialog";
import { EditListingDialog } from "@/components/admin/EditListingDialog";
import { toast } from "sonner";
import { TableRowSkeleton } from "@/components/skeletons/TableRowSkeleton";

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
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getListings();
      setListings(data);
    } catch (error) {
      // Error toast handled by api client
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleEdit = (listing: Listing) => {
    setSelectedListing(listing);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (listing: Listing) => {
    setSelectedListing(listing);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedListing) return;
    try {
      await api.deleteListing(selectedListing.id);
      toast.success("Item succesvol verwijderd.");
      fetchListings();
    } catch (error) {
      // Error toast handled by api client
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedListing(null);
    }
  };

  return (
    <>
      <AddListingDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        onListingAdded={fetchListings}
      />
      {selectedListing && (
        <EditListingDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          onListingUpdated={fetchListings}
          listing={selectedListing}
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
              Deze actie kan niet ongedaan worden gemaakt. Dit zal het item
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Aanbodbeheer</CardTitle>
              <CardDescription>
                Beheer hier het aanbod van auto's en boten.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
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
                <TableHead className="text-right">Acties</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRowSkeleton key={i} columns={6} />
                ))
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
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(listing)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Bewerken
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(listing)}
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
                  <TableCell colSpan={6}>
                    <div className="flex flex-col items-center justify-center text-center py-16">
                      <Car className="h-16 w-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold">Nog geen aanbod</h3>
                      <p className="text-muted-foreground mb-6 max-w-sm">
                        Voeg het eerste item toe aan uw aanbod om het hier te
                        zien.
                      </p>
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Nieuw Aanbod Toevoegen
                      </Button>
                    </div>
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