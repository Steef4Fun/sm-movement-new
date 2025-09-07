"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Footer } from "@/components/footer";
import { Preloader } from "@/components/preloader";
import { FullPageSection } from "@/components/FullPageSection";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preloader remains, but body scroll manipulation is removed for snap scroll
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>

      <div className="h-screen overflow-y-scroll snap-y snap-mandatory font-[family-name:var(--font-geist-sans)]">
        <Header />
        <main>
          <FullPageSection className="p-0">
            <Hero />
          </FullPageSection>

          <FullPageSection>
            <Services />
          </FullPageSection>

          <FullPageSection>
            <Footer />
          </FullPageSection>
        </main>
      </div>
    </>
  );
}