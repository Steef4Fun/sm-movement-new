"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Car, Ship } from "lucide-react";
import Link from "next/link";
import * as api from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";

type Listing = {
  id: string;
  name: string;
  status: string;
  year: number | null;
  type: "Auto" | "Boot";
  price: number;
};

const FeaturedCarSkeleton = () => (
  <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
    <Skeleton className="h-64 w-full" />
    <div className="p-6">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/4 mb-4" />
      <div className="space-y-2 mb-6">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
        <div className="flex justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </div>
  </div>
);

export const FeaturedCars = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const data = await api.getListings();
        const availableListings = data.filter(
          (l: Listing) => l.status === "beschikbaar"
        );
        setListings(availableListings.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch listings for featured section", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-muted/20 px-6 text-2xl font-semibold text-foreground">
                Uitgelicht Aanbod
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <FeaturedCarSkeleton key={i} />
              ))
            : listings.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  className="group cursor-pointer"
                >
                  <div className="relative bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/30 group-hover:scale-[1.02]">
                    <div className="relative h-64 bg-gradient-to-br from-muted/50 to-muted overflow-hidden flex items-center justify-center">
                      {item.type === "Auto" ? (
                        <Car className="h-24 w-24 text-muted-foreground/50" />
                      ) : (
                        <Ship className="h-24 w-24 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-foreground mb-1 truncate">
                        {item.name}
                      </h3>
                      <div className="space-y-2 my-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="text-foreground">{item.type}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Bouwjaar:</span>
                          <span className="text-foreground">{item.year || "N/A"}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-foreground">
                          {new Intl.NumberFormat("nl-NL", {
                            style: "currency",
                            currency: "EUR",
                            minimumFractionDigits: 0,
                          }).format(item.price)}
                        </span>
                        <Button
                          asChild
                          className="rounded-full bg-foreground text-background hover:bg-foreground/90 group-hover:shadow-lg transition-all duration-300"
                        >
                          <Link
                            href={`/aanbod/${item.id}`}
                            className="flex items-center gap-2"
                          >
                            Bekijken
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
};