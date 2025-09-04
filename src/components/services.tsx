import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Car, Ship, Sparkles, Wrench } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: <Car className="h-8 w-8 text-primary" />,
      title: "Auto's",
      description: "Ontdek onze collectie van premium en sportieve auto's.",
    },
    {
      icon: <Ship className="h-8 w-8 text-primary" />,
      title: "Boten",
      description: "Vaar in stijl met onze selectie van luxe jachten en boten.",
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: "Detailing",
      description: "Laat uw voertuig weer stralen met onze professionele schoonmaakdiensten.",
    },
    {
      icon: <Wrench className="h-8 w-8 text-primary" />,
      title: "Tuning",
      description: "Optimaliseer de prestaties en het uiterlijk van uw auto.",
    },
  ];

  return (
    <section id="services" className="py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Onze Diensten</h2>
          <p className="text-muted-foreground mt-2">Wat wij voor u kunnen betekenen.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader className="items-center text-center p-6">
                {service.icon}
                <CardTitle className="mt-4">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};