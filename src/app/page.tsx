"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Services } from "@/components/services";
import { Footer } from "@/components/footer";
import { Preloader } from "@/components/preloader";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      document.body.style.overflow = "auto";
    }, 2500); // Preloader duration

    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>

      <div className="flex flex-col min-h-screen bg-background font-[family-name:var(--font-geist-sans)]">
        <Header />
        <main>
          <Hero />
          <Services />
        </main>
        <Footer />
      </div>
    </>
  );
}