"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const Preloader = () => {
  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeIn" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
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