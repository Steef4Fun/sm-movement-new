"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { SearchSection } from "@/components/search-section";
import { BrandsSection } from "@/components/brands-section";
import { FeaturedCars } from "@/components/featured-cars";
import { Services } from "@/components/services";
import { EVsPromo } from "@/components/evs-promo";
import { Footer } from "@/components/footer";
import { Preloader } from "@/components/preloader";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const sections = [
    { id: "intro", label: "Introductie" },
    { id: "search", label: "Zoeken" },
    { id: "brands", label: "Merken" },
    { id: "featured", label: "Uitgelicht" },
    { id: "services", label: "Expertise" },
    { id: "zoekopdracht", label: "Zoekopdracht" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "auto";
    }, 1500);

    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>

      {!isLoading && (
        <div className="bg-background font-sans">
          <Header />
          <ScrollProgress sections={sections} />
          <main>
            <div id="intro">
              <Hero id="intro" />
            </div>
            <div id="search">
              <SearchSection />
            </div>
            <div id="brands">
              <BrandsSection />
            </div>
            <div id="featured">
              <FeaturedCars />
            </div>
            <div id="services">
              <Services id="services" />
            </div>
            <div id="zoekopdracht">
              <EVsPromo />
            </div>
          </main>
          <Footer />
        </div>
      )}
    </>
  );
}