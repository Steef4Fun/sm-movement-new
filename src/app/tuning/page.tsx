"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cpu, Gauge, ArrowDownToLine, ToyBrick } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export default function TuningPage() {
  const tuningOptions = [
    {
      icon: <Cpu className="h-8 w-8 text-primary" />,
      title: "Chiptuning & ECU Remapping",
      description:
        "Ontgrendel het ware potentieel van uw motor met onze op maat gemaakte software-aanpassingen voor meer vermogen en koppel.",
    },
    {
      icon: <Gauge className="h-8 w-8 text-primary" />,
      title: "Performance Uitlaatsystemen",
      description:
        "Verbeter de prestaties en het geluid van uw auto met hoogwaardige uitlaatsystemen van topmerken.",
    },
    {
      icon: <ArrowDownToLine className="h-8 w-8 text-primary" />,
      title: "Onderstel & Verlaging",
      description:
        "Optimaliseer de wegligging en geef uw auto een agressievere look met professionele onderstel-upgrades en verlaging.",
    },
    {
      icon: <ToyBrick className="h-8 w-8 text-primary" />,
      title: "Exterieur & Bodykits",
      description:
        "Personaliseer het uiterlijk van uw auto met aerodynamische bodykits, spoilers en andere exterieurmodificaties.",
    },
  ];

  const processSteps = [
    {
      title: "Consultatie",
      description:
        "We bespreken uw wensen en de mogelijkheden voor uw specifieke voertuig.",
    },
    {
      title: "Planning & Offerte",
      description:
        "U ontvangt een duidelijke planning en een transparante offerte op maat.",
    },
    {
      title: "Uitvoering",
      description:
        "Onze experts voeren de tuning met de grootste zorg en precisie uit.",
    },
    {
      title: "Oplevering & Nazorg",
      description:
        "We leveren de auto op, lichten de aanpassingen toe en bieden uitstekende nazorg.",
    },
  ];

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="relative flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/tuning-hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
          <div className="relative z-10 text-center text-white px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
                Performance Tuning
              </h1>
              <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                Verleg de grenzen van uw auto. Wij combineren geavanceerde
                technologie met vakmanschap om de ultieme rijervaring te
                creëren.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Tuning Options Section */}
        <section className="sticky top-0 min-h-screen flex items-center bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Onze Tuning Diensten
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Van subtiele upgrades tot complete transformaties, wij bieden
                een breed scala aan tuning-mogelijkheden.
              </p>
            </motion.div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {tuningOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={cardVariants}
                >
                  <Card className="text-center h-full hover:shadow-lg transition-shadow duration-300 flex flex-col">
                    <CardHeader>
                      <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                        {option.icon}
                      </div>
                      <CardTitle className="mt-4">{option.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-muted-foreground">
                        {option.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="sticky top-0 min-h-screen flex items-center bg-secondary">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Onze Werkwijze
              </h2>
              <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                Een transparant en gestroomlijnd proces, van het eerste gesprek
                tot de uiteindelijke oplevering.
              </p>
            </motion.div>
            <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.title}
                  className="flex flex-col items-center text-center"
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.5 }}
                  variants={cardVariants}
                >
                  <div className="bg-primary text-primary-foreground h-12 w-12 rounded-full flex items-center justify-center font-bold text-xl mb-4">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="sticky top-0 min-h-screen flex items-center justify-center text-center bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Klaar om uw auto te transformeren?
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                Neem vandaag nog contact met ons op voor een vrijblijvend consult
                en ontdek wat we voor u kunnen betekenen.
              </p>
              <div className="mt-8">
                <Button asChild size="lg">
                  <Link href="/contact">Vraag een offerte aan</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}