"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Car, ShieldCheck, Gem } from "lucide-react";
import Link from "next/link";
import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { ScrollProgress } from "@/components/ScrollProgress";

export default function DetailingPage() {
  const sections = [
    { id: "intro", label: "Introductie" },
    { id: "diensten", label: "Diensten" },
    { id: "proces", label: "Proces" },
    { id: "contact", label: "Afspraak" },
  ];

  const detailingServices = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Exterieur Perfectie",
      description:
        "Herstel de glans van uw lak met onze geavanceerde polijst- en correctietechnieken. We verwijderen krassen en imperfecties voor een spiegelglad resultaat.",
    },
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: "Interieur Verfijning",
      description:
        "Een diepgaande reiniging en verzorging van het interieur. Van lederbehandeling tot het reinigen van de kleinste details, voor een cabine die als nieuw aanvoelt.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      title: "Keramische Coating",
      description:
        "Bied uw auto de ultieme bescherming met een professionele keramische coating. Extreem water- en vuilafstotend met een ongeëvenaarde diepe glans.",
    },
    {
      icon: <Gem className="h-8 w-8 text-primary" />,
      title: "Complete Transformatie",
      description:
        "Het beste van alle werelden. Een volledige detailing van zowel interieur als exterieur, afgesloten met een duurzame beschermlaag naar keuze.",
    },
  ];

  const processSteps = [
    {
      title: "Inspectie & Advies",
      description:
        "We analyseren de staat van uw auto en adviseren u over de beste behandeling.",
    },
    {
      title: "Grondige Voorbereiding",
      description:
        "De auto wordt zorgvuldig gewassen en voorbereid op de detailing.",
    },
    {
      title: "Precisie Detailing",
      description:
        "Onze specialisten gaan met uiterste precisie en de beste producten te werk.",
    },
    {
      title: "Finale Inspectie",
      description:
        "We lopen de auto volledig na om te garanderen dat alles in perfecte staat is.",
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

  const sectionVariants: HTMLMotionProps<"section"> = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
    viewport: { once: true, amount: 0.075 }
  };

  return (
    <div className="bg-background">
      <Header />
      <ScrollProgress sections={sections} />
      <main>
        <div className="relative h-[400vh]">
          {/* Hero Section */}
          <motion.section
            id="intro"
            className="relative flex items-center justify-center h-screen bg-cover bg-center bg-no-repeat sticky top-0"
            style={{ backgroundImage: "url('/detailing-hero.jpg')" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent" />
            <div className="relative z-10 text-center text-white px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight">
                  Professionele Detailing
                </h1>
                <p className="mt-4 max-w-3xl mx-auto text-lg text-gray-300">
                  Oog voor detail is geen optie, het is onze standaard. Wij
                  transformeren uw auto tot in absolute perfectie.
                </p>
              </motion.div>
            </div>
          </motion.section>

          {/* Detailing Services Section */}
          <motion.section id="diensten" className="sticky top-0 h-screen flex items-center bg-background" {...sectionVariants}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
              <div
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Onze Detailing Diensten
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                  Elke auto verdient de beste zorg. Ontdek onze pakketten,
                  ontworpen voor elk niveau van perfectie.
                </p>
              </div>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                {detailingServices.map((service, index) => (
                  <motion.div
                    key={service.title}
                    custom={index}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={cardVariants}
                  >
                    <Card className="text-center h-full bg-card rounded-2xl border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 hover:border-primary/30 hover:scale-[1.02] flex flex-col">
                      <CardHeader>
                        <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                          {service.icon}
                        </div>
                        <CardTitle className="mt-4">{service.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        <p className="text-muted-foreground">
                          {service.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Our Process Section */}
          <motion.section id="proces" className="sticky top-0 h-screen flex items-center bg-secondary" {...sectionVariants}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
              <div
                className="text-center mb-16"
              >
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Ons Proces
                </h2>
                <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
                  Een gestructureerde aanpak voor een vlekkeloos resultaat, elke
                  keer weer.
                </p>
              </div>
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
          </motion.section>

          {/* Call to Action Section */}
          <motion.section id="contact" className="sticky top-0 h-screen flex items-center justify-center text-center bg-background" {...sectionVariants}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Klaar voor een Showroom-Finish?
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-muted-foreground">
                  Laat uw auto door ons behandelen en ervaar een nieuw niveau van
                  schoon en glans. Neem contact op voor een afspraak.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="rounded-full">
                    <Link href="/contact">Maak een afspraak</Link>
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
}