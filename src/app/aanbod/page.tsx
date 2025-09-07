"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import * as api from "@/lib/api";
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
import { Car, Ship, Search, XCircle } from "lucide-react";
import Link from "next/link";
import { ListingCardSkeleton } from "@/components/skeletons/ListingCardSkeleton";

type Listing = {
  id: string;
  type: "Auto" | "Boot";
  name: string;
  year: number | null;
  mileage: number | null;
  sailing_hours: number | null;
  price: number;
  created_at: string;
};

export default function AanbodPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const fetchListings = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getListings();
      setListings(data);
    } catch (error) {
      // Error is handled by the API client
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedType !== "all") {
      result = result.filter((item) =>
        selectedType === "car" ? item.type === "Auto" : item.type === "Boot"
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
    }

    return result;
  }, [listings, searchQuery, selectedType, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSortBy("newest");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="sticky top-0 min-h-screen flex items-center justify-center text-center bg-secondary/30">
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
        <section className="sticky top-0 min-h-screen flex items-center bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            {/* Filter Bar */}
            <div className="mb-12 p-6 border rounded-lg bg-card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger id="type">
                      <SelectValue />
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
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort">
                      <SelectValue />
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
              </div>
            </div>

            {/* Listings Grid */}
            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <ListingCardSkeleton key={i} />
                ))}
              </div>
            ) : filteredListings.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredListings.map((item) => (
                  <Card
                    key={item.id}
                    className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
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
              <div className="text-center py-16 flex flex-col items-center">
                <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold tracking-tight">
                  Geen resultaten gevonden
                </h2>
                <p className="mt-2 text-muted-foreground mb-6">
                  Probeer uw zoekopdracht aan te passen.
                </p>
                <Button onClick={resetFilters}>Reset filters</Button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="sticky top-0 min-h-screen flex items-center justify-center text-center bg-background">
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