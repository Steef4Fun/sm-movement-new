"use client";

import { motion, Variants } from "framer-motion";
import { Car, Sparkles, Cpu } from "lucide-react";

export const Services = ({ id }: { id: string }) => {
  const services = [
    {
      icon: <Car className="h-10 w-10 text-primary mb-4" />,
      title: "Exclusief Aanbod",
      description:
        "Ontdek onze zorgvuldig geselecteerde collectie van premium auto's en luxe boten.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
      title: "Professionele Detailing",
      description:
        "Laat uw voertuig tot in perfectie verzorgen met onze high-end detailing services.",
    },
    {
      icon: <Cpu className="h-10 w-10 text-primary mb-4" />,
      title: "Performance Tuning",
      description:
        "Ontgrendel het ware potentieel van uw auto met onze op maat gemaakte tuning-oplossingen.",
    },
  ];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: "easeOut",
      },
    }),
  };

  return (
    <section
      id={id}
      className="py-20 bg-background"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-6 text-2xl font-semibold text-foreground">
                Onze Expertise
              </span>
            </div>
          </div>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Gedreven door passie, geleverd met perfectie. Ontdek de kern van onze dienstverlening.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className="group text-center p-8 bg-card rounded-2xl border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-primary/30 hover:scale-[1.02]"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.5 }}
              variants={cardVariants}
            >
              <div className="flex justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};