"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import * as api from "@/lib/api";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Ship, Calendar, Gauge, Clock, Euro } from "lucide-react";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Listing = {
  id: string;
  type: "Auto" | "Boot";
  name: string;
  brand: string | null;
  model: string | null;
  year: number | null;
  mileage: number | null;
  sailing_hours: number | null;
  price: number;
  description: string | null;
  images: string[];
  videos: string[];
};

export default function ListingDetailPage() {
  const params = useParams();
  const { id } = params;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchListing = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await api.getListingById(id as string);
      setListing(data);
    } catch (error) {
      setListing(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchListing();
  }, [fetchListing]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-grow flex items-center justify-center text-center">
          <div>
            <h1 className="text-4xl font-bold">Aanbod niet gevonden</h1>
            <p className="mt-4 text-muted-foreground">
              Het item dat u zoekt is niet (meer) beschikbaar.
            </p>
            <Button asChild className="mt-8 rounded-full">
              <Link href="/aanbod">Terug naar aanbod</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const details = [
    { icon: Euro, label: "Prijs", value: new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(listing.price) },
    { icon: Calendar, label: "Bouwjaar", value: listing.year },
    ...(listing.type === "Auto" ? [
      { icon: Gauge, label: "Kilometerstand", value: listing.mileage ? `${listing.mileage.toLocaleString('nl-NL')} km` : null },
    ] : []),
    ...(listing.type === "Boot" ? [
      { icon: Clock, label: "Vaaruren", value: listing.sailing_hours },
    ] : []),
    { icon: listing.type === "Auto" ? Car : Ship, label: "Type", value: listing.type },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-32 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Image Gallery */}
            <div>
              {listing.images && listing.images.length > 0 ? (
                <Carousel className="w-full rounded-2xl overflow-hidden shadow-lg">
                  <CarouselContent>
                    {listing.images.map((src, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video">
                          <Image src={src} alt={`${listing.name} image ${index + 1}`} layout="fill" className="object-cover" />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="ml-16" />
                  <CarouselNext className="mr-16" />
                </Carousel>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted rounded-2xl flex items-center justify-center shadow-lg">
                  {listing.type === "Auto" ? (
                    <Car className="h-24 w-24 text-muted-foreground/50" />
                  ) : (
                    <Ship className="h-24 w-24 text-muted-foreground/50" />
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight mb-4">
                {listing.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {listing.description || "Geen omschrijving beschikbaar."}
              </p>

              <Card className="bg-card rounded-2xl shadow-lg border border-border/50">
                <CardHeader>
                  <CardTitle>Specificaties</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-4">
                    {details.map((detail) =>
                      detail.value ? (
                        <li key={detail.label} className="flex items-center gap-3">
                          <detail.icon className="h-5 w-5 text-primary" />
                          <div>
                            <span className="text-sm text-muted-foreground">{detail.label}</span>
                            <p className="font-semibold">{String(detail.value)}</p>
                          </div>
                        </li>
                      ) : null
                    )}
                  </ul>
                </CardContent>
              </Card>

              <Button asChild size="lg" className="mt-8 w-full md:w-auto rounded-full">
                <Link href="/contact">Neem contact op voor dit item</Link>
              </Button>
            </div>
          </div>

          {/* Videos Section */}
          {listing.videos && listing.videos.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold text-center mb-8">Videos</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {listing.videos.map((src, index) => (
                  <div key={index} className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <video controls src={src} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}