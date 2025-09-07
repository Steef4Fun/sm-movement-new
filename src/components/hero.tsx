"use client";

import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="relative flex items-center justify-center h-screen overflow-hidden">
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
      <div className="absolute inset-0 bg-black/50 z-10" />

      <div className="relative z-20 text-center px-4 text-white">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="text-5xl md:text-8xl font-extrabold tracking-tighter mb-4"
        >
          SM Movement
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
          className="max-w-3xl mx-auto text-xl text-gray-200"
        >
          Exclusiviteit in beweging. Van premium auto's en luxe boten tot
          meesterlijke detailing en tuning.
        </motion.p>
      </div>
    </section>
  );
};