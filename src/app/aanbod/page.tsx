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
import { CtaSection } from "@/components/cta-section";
import { motion } from "framer-motion";

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
        <section className="relative flex items-center justify-center h-[50vh] bg-gradient-to-br from-background to-muted">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 text-center text-white px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight">
                Exclusief Aanbod
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                Ontdek onze zorgvuldig geselecteerde collectie van premium auto's en luxe boten.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filters & Listings Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Bar */}
            <div className="mb-12 p-6 md:p-8 bg-card rounded-2xl shadow-lg border border-border/50">
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
                    className="group cursor-pointer bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/30 group-hover:scale-[1.02] flex flex-col"
                  >
                    <CardHeader className="p-0">
                      <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
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
                    <CardFooter className="p-6 bg-muted/30 flex justify-between items-center">
                      <p className="text-lg font-bold">
                        {new Intl.NumberFormat("nl-NL", {
                          style: "currency",
                          currency: "EUR",
                        }).format(item.price)}
                      </p>
                      <Button asChild variant="outline" className="rounded-full">
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
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}