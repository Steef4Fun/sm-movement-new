"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const EVsPromo = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[400px] lg:h-[500px] rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted shadow-2xl">
              {/* Placeholder for image */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center">
                <span className="text-2xl font-bold text-muted-foreground">
                  Uw Droomvoertuig
                </span>
              </div>
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
                Niet gevonden wat u zocht?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Ons netwerk reikt verder dan onze showroom. Laat ons weten wat u zoekt, en wij gaan voor u op zoek naar uw droomvoertuig of -boot.
              </p>
            </div>

            <Button 
              asChild
              size="lg"
              className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-8 py-3 text-base font-semibold group"
            >
              <Link href="/contact" className="flex items-center gap-2">
                Plaats een zoekopdracht
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};