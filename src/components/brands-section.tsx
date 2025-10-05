"use client";

import { motion, Variants } from "framer-motion";

export const BrandsSection = () => {
  const brands = [
    { name: "Audi", logo: "/brands/audi.svg" },
    { name: "BMW", logo: "/brands/bmw.svg" },
    { name: "Mercedes-Benz", logo: "/brands/mercedes.svg" },
    { name: "Porsche", logo: "/brands/porsche.svg" },
    { name: "Ferrari", logo: "/brands/ferrari.svg" },
    { name: "Lamborghini", logo: "/brands/lamborghini.svg" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-muted/30 px-6 text-2xl font-semibold text-foreground">
                Topmerken
              </span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {brands.map((brand, index) => (
            <motion.div
              key={`${brand.name}-${index}`}
              variants={itemVariants}
              className="group cursor-pointer"
            >
              <div className="relative w-full h-20 flex items-center justify-center p-4 rounded-lg border border-border/30 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-card hover:shadow-lg group-hover:scale-105">
                {/* Placeholder for brand logos - replace with actual logos */}
                <div className="w-full h-full flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors duration-300">
                  <span className="text-lg font-semibold">{brand.name}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};