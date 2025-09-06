"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Car, Ship, Search, Loader2 } from "lucide-react";
import Link from "next/link";

type Listing = {
  id: string;
  type: "Auto" | "Boot";
  name: string;
  year: number | null;
  mileage: number | null;
  sailing_hours: number | null;
  price: number;
};

export default function AanbodPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "beschikbaar")
      .order("created_at", { ascending: false });

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
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 text-center bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
              Exclusief Aanbod
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
              Ontdek onze zorgvuldig geselecteerde collectie van premium auto's
              en luxe boten.
            </p>
          </div>
        </section>

        {/* Filters & Listings Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Bar */}
            <div className="mb-12 p-6 border rounded-lg bg-card">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2">
                  <label htmlFor="search" className="text-sm font-medium">
                    Zoekterm
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Bijv. Audi RS6"
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Type
                  </label>
                  <Select>
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Alles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alles</SelectItem>
                      <SelectItem value="car">Auto's</SelectItem>
                      <SelectItem value="boat">Boten</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="sort" className="text-sm font-medium">
                    Sorteer op
                  </label>
                  <Select>
                    <SelectTrigger id="sort">
                      <SelectValue placeholder="Nieuwste eerst" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Nieuwste eerst</SelectItem>
                      <SelectItem value="price-asc">
                        Prijs (laag naar hoog)
                      </SelectItem>
                      <SelectItem value="price-desc">
                        Prijs (hoog naar laag)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full">Zoeken</Button>
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : listings.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {listings.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-secondary flex items-center justify-center">
                        {item.type === "Auto" ? (
                          <Car className="h-16 w-16 text-muted-foreground" />
                        ) : (
                          <Ship className="h-16 w-16 text-muted-foreground" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex-grow">
                      <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                      <div className="text-sm text-muted-foreground space-y-1">
                        {item.year && <p><strong>Bouwjaar:</strong> {item.year}</p>}
                        {item.type === "Auto" && item.mileage != null && (
                          <p>
                            <strong>Kilometerstand:</strong>{" "}
                            {item.mileage.toLocaleString('nl-NL')} km
                          </p>
                        )}
                        {item.type === "Boot" && item.sailing_hours != null && (
                          <p>
                            <strong>Vaaruren:</strong> {item.sailing_hours}
                          </p>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-6 bg-secondary/30 flex justify-between items-center">
                      <p className="text-lg font-bold">
                        {new Intl.NumberFormat("nl-NL", {
                          style: "currency",
                          currency: "EUR",
                        }).format(item.price)}
                      </p>
                      <Button asChild variant="outline">
                        <Link href={`/aanbod/${item.id}`}>Bekijk</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-bold tracking-tight">
                  Geen aanbod gevonden
                </h2>
                <p className="mt-4 text-muted-foreground">
                  Onze showroom is momenteel leeg. Kom snel terug!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-28 text-center border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Zoekt u iets specifieks?
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
              Ons netwerk reikt verder dan onze showroom. Laat ons weten wat u
              zoekt, en wij gaan voor u op zoek naar uw droomvoertuig of -boot.
            </p>
            <div className="mt-8">
              <Button asChild size="lg">
                <Link href="/contact">Plaats een zoekopdracht</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}