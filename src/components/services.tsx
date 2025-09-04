"use client";

import { motion } from "framer-motion";
import { Car, Ship, Sparkles, Wrench } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: <Car className="h-10 w-10 text-primary mb-4" />,
      title: "Exclusieve Auto's",
      description:
        "Ontdek onze zorgvuldig geselecteerde collectie van premium en sportieve auto's.",
    },
    {
      icon: <Ship className="h-10 w-10 text-primary mb-4" />,
      title: "Luxe Boten",
      description:
        "Vaar in stijl met onze selectie van luxe jachten en high-performance boten.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
      title: "Professionele Detailing",
      description:
        "Laat uw voertuig tot in perfectie verzorgen met onze toonaangevende detailingdiensten.",
    },
    {
      icon: <Wrench className="h-10 w-10 text-primary mb-4" />,
      title: "Performance Tuning",
      description:
        "Optimaliseer de prestaties en het uiterlijk van uw auto met maatwerk tuning.",
    },
  ];

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Onze Expertise
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Vier pijlers van excellentie, één standaard van perfectie.
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="text-left p-8 border border-border rounded-lg hover:bg-secondary/50 transition-colors duration-300"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              {service.icon}
              <h3 className="text-2xl font-semibold">{service.title}</h3>
              <p className="text-muted-foreground mt-2">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};