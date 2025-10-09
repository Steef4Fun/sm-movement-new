"use client";

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Car, Ship, Search, XCircle, Filter } from "lucide-react";
import Link from "next/link";
import { ListingCardSkeleton } from "@/components/skeletons/ListingCardSkeleton";
import { CtaSection } from "@/components/cta-section";

type Listing = {
  id: string;
  type: "Auto" | "Boot";
  name: string;
  brand: string | null;
  condition: string;
  year: number | null;
  mileage: number | null;
  sailing_hours: number | null;
  price: number;
  created_at: string;
  status: string;
};

function AanbodContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [selectedType, setSelectedType] = useState(searchParams.get("type") || "all");
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get("brand") || "all");
  const [selectedCondition, setSelectedCondition] = useState(searchParams.get("condition") || "all");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

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

  const uniqueBrands = useMemo(() => {
    if (!listings) return [];
    const brands = new Set(listings.map(l => l.brand).filter((b): b is string => !!b));
    return Array.from(brands).sort();
  }, [listings]);

  const filteredListings = useMemo(() => {
    let result = listings.filter(l => l.status === 'beschikbaar');

    if (searchQuery) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (selectedType !== "all") {
      result = result.filter((item) => item.type.toLowerCase() === selectedType);
    }
    if (selectedBrand !== "all") {
      result = result.filter((item) => item.brand === selectedBrand);
    }
    if (selectedCondition !== "all") {
      result = result.filter((item) => item.condition === selectedCondition);
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
  }, [listings, searchQuery, selectedType, sortBy, selectedBrand, selectedCondition]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSelectedBrand("all");
    setSelectedCondition("all");
    setSortBy("newest");
  };

  const FilterControls = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="search" className="text-sm font-medium">Zoek op naam/model</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input id="search" placeholder="Bijv. Audi RS6" className="pl-10" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium">Type</label>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger id="type"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alles</SelectItem>
            <SelectItem value="Auto">Auto's</SelectItem>
            <SelectItem value="Boot">Boten</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="brand" className="text-sm font-medium">Merk</label>
        <Select value={selectedBrand} onValueChange={setSelectedBrand} disabled={uniqueBrands.length === 0}>
          <SelectTrigger id="brand"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle merken</SelectItem>
            {uniqueBrands.map(brand => <SelectItem key={brand} value={brand}>{brand}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="condition" className="text-sm font-medium">Conditie</label>
        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
          <SelectTrigger id="condition"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Nieuw & Gebruikt</SelectItem>
            <SelectItem value="nieuw">Nieuw</SelectItem>
            <SelectItem value="gebruikt">Gebruikt</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <label htmlFor="sort" className="text-sm font-medium">Sorteer op</label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger id="sort"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Nieuwste eerst</SelectItem>
            <SelectItem value="price-asc">Prijs (laag naar hoog)</SelectItem>
            <SelectItem value="price-desc">Prijs (hoog naar laag)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={resetFilters} variant="ghost" className="w-full">Reset filters</Button>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Filters</h3>
                <FilterControls />
              </div>
            </aside>

            {/* Mobile Filters & Listings */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold tracking-tight">
                  Ons Aanbod ({filteredListings.length})
                </h1>
                <div className="lg:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Filter className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <h3 className="text-lg font-semibold mb-4">Filters</h3>
                      <FilterControls />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {loading ? (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => <ListingCardSkeleton key={i} />)}
                </div>
              ) : filteredListings.length > 0 ? (
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                  {filteredListings.map((item) => (
                    <Card
                      key={item.id}
                      className="group cursor-pointer bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/30 group-hover:scale-[1.02] flex flex-col"
                    >
                      <CardHeader className="p-0">
                        <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center">
                          {item.type === "Auto" ? <Car className="h-16 w-16 text-muted-foreground" /> : <Ship className="h-16 w-16 text-muted-foreground" />}
                        </div>
                      </CardHeader>
                      <CardContent className="p-6 flex-grow">
                        <CardTitle className="text-xl mb-2">{item.name}</CardTitle>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {item.year && <p><strong>Bouwjaar:</strong> {item.year}</p>}
                          {item.type === "Auto" && item.mileage != null && <p><strong>KM:</strong> {item.mileage.toLocaleString('nl-NL')} km</p>}
                          {item.type === "Boot" && item.sailing_hours != null && <p><strong>Vaaruren:</strong> {item.sailing_hours}</p>}
                        </div>
                      </CardContent>
                      <CardFooter className="p-6 bg-muted/30 flex justify-between items-center">
                        <p className="text-lg font-bold">{new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(item.price)}</p>
                        <Button asChild variant="outline" className="rounded-full"><Link href={`/aanbod/${item.id}`}>Bekijk</Link></Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 flex flex-col items-center col-span-full">
                  <XCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-2xl font-bold tracking-tight">Geen resultaten gevonden</h2>
                  <p className="mt-2 text-muted-foreground mb-6">Probeer uw zoekopdracht aan te passen.</p>
                  <Button onClick={resetFilters}>Reset filters</Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

export default function AanbodPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AanbodContent />
    </Suspense>
  );
}