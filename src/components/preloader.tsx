"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

export const Preloader = () => {
  const logoVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ y: 0 }}
      exit={{ y: "-100vh", transition: { duration: 1, ease: [0.87, 0, 0.13, 1], delay: 0.2 } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
        exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeOut" } }}
      >
        <Image
          src="/logo-full.png"
          alt="SM Movement Logo"
          width={250}
          height={250}
          priority
          unoptimized
        />
      </motion.div>
    </motion.div>
  );
};