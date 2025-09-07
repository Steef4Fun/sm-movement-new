"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Footer } from "@/components/footer";
import { Preloader } from "@/components/preloader";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const sections = [
    { id: "intro", label: "Introductie" },
    { id: "services", label: "Expertise" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "auto";
    }, 1500); // Preloader duration shortened

    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>

      <div className="bg-background font-[family-name:var(--font-geist-sans)]">
        <Header />
        {!isLoading && <ScrollProgress sections={sections} />}
        <main>
          <div className="relative h-[200vh]">
            <Hero id="intro" />
            <Services id="services" />
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}