"use client";

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
import { Car, Ship, Search } from "lucide-react";
import Link from "next/link";

// Placeholder data
const placeholderListings = [
  {
    type: "Auto",
    name: "Audi RS6 Avant",
    year: 2023,
    mileage: "12.000 km",
    price: "€ 185.000",
  },
  {
    type: "Boot",
    name: "VanDutch 40",
    year: 2022,
    hours: "80 vaaruren",
    price: "€ 550.000",
  },
  {
    type: "Auto",
    name: "Porsche 911 GT3",
    year: 2024,
    mileage: "1.500 km",
    price: "€ 310.000",
  },
];

export default function AanbodPage() {
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
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight">
                Binnenkort Beschikbaar
              </h2>
              <p className="mt-4 text-muted-foreground">
                Onze showroom wordt momenteel gevuld. Hieronder vindt u een
                voorproefje van wat u kunt verwachten.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
              {placeholderListings.map((item, index) => (
                <Card
                  key={index}
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
                      <p>
                        <strong>Bouwjaar:</strong> {item.year}
                      </p>
                      <p>
                        <strong>
                          {item.type === "Auto"
                            ? "Kilometerstand"
                            : "Vaaruren"}
                          :
                        </strong>{" "}
                        {item.type === "Auto" ? item.mileage : item.hours}
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 bg-secondary/30 flex justify-between items-center">
                    <p className="text-lg font-bold">{item.price}</p>
                    <Button variant="outline">Bekijk</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
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