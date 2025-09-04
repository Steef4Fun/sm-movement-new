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
      exit={{ opacity: 0, transition: { duration: 0.8, delay: 1, ease: "easeIn" } }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
    >
      <motion.div
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <Image
          src="/logo.png"
          alt="SM Movement Logo"
          width={150}
          height={150}
          priority
          unoptimized
        />
      </motion.div>
    </motion.div>
  );
};