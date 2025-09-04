import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Ship, Sparkles, Wrench } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: <Car className="h-10 w-10 text-primary mb-4" />,
      title: "Exclusieve Auto's",
      description: "Ontdek onze zorgvuldig geselecteerde collectie van premium en sportieve auto's.",
    },
    {
      icon: <Ship className="h-10 w-10 text-primary mb-4" />,
      title: "Luxe Boten",
      description: "Vaar in stijl met onze selectie van luxe jachten en high-performance boten.",
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary mb-4" />,
      title: "Professionele Detailing",
      description: "Laat uw voertuig tot in perfectie verzorgen met onze toonaangevende detailingdiensten.",
    },
    {
      icon: <Wrench className="h-10 w-10 text-primary mb-4" />,
      title: "Performance Tuning",
      description: "Optimaliseer de prestaties en het uiterlijk van uw auto met maatwerk tuning.",
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Onze Expertise</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Vier pijlers van excellentie, één standaard van perfectie.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {services.map((service) => (
            <div key={service.title} className="text-left p-8 border border-border rounded-lg hover:bg-secondary/50 transition-colors duration-300">
              {service.icon}
              <h3 className="text-2xl font-semibold">{service.title}</h3>
              <p className="text-muted-foreground mt-2">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};