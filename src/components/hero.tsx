"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const Hero = ({ id }: { id: string }) => {
  return (
    <section id={id} className="relative flex items-center justify-center h-screen sticky top-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute z-0 w-full h-full object-cover"
        src="/hero-video.mp4"
      >
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-center mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-4 text-primary"
          >
            SM Movement
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="max-w-3xl mx-auto text-xl text-gray-200 font-serif"
          >
            Exclusiviteit in beweging. Van premium auto's en luxe boten tot
            meesterlijke detailing en tuning.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-10 flex justify-center gap-4"
          >
            <Button
              asChild
              size="lg"
              className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 text-base font-semibold shadow-lg"
            >
              <Link href="/aanbod" className="flex items-center gap-2">
                Bekijk aanbod
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};