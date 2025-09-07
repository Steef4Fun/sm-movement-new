"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
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
    }, 1500);

    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto";
    };
  }, []);

  const sectionVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } },
  };

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader />}</AnimatePresence>

      <div className="bg-background font-sans">
        <Header />
        {!isLoading && <ScrollProgress sections={sections} />}
        <main>
          <div className="relative h-[200vh]">
            <motion.div variants={sectionVariants} initial="initial" animate="animate" exit="exit">
              <Hero id="intro" />
            </motion.div>
            <motion.div variants={sectionVariants} initial="initial" animate="animate" exit="exit">
              <Services id="services" />
            </motion.div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}