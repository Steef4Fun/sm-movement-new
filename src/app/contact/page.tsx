import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Mail, MapPin, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative flex items-center justify-center h-[50vh] bg-gradient-to-br from-background to-muted">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <div className="relative z-20 text-center text-white px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <h1 className="text-4xl md:text-6xl font-bold font-serif tracking-tight">
                Neem Contact Op
              </h1>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-300">
                Heeft u een vraag of wilt u een afspraak maken? We horen graag van u.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-16 max-w-6xl mx-auto items-start">
              {/* Column 1: Details */}
              <Card className="bg-card rounded-2xl shadow-lg border border-border/50 p-4 md:p-6">
                <CardHeader>
                  <CardTitle className="text-3xl">Onze Gegevens</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-md">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Locatie</h3>
                      <p className="text-muted-foreground">
                        Woudmeer 16, Houten
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-md">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Telefoon</h3>
                      <p className="text-muted-foreground">+31 085 369 5189</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-md">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold">E-mail</h3>
                      <p className="text-muted-foreground">info@sm-movement.nl</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Column 2: Map */}
              <Card className="bg-card rounded-2xl shadow-lg border border-border/50 p-4 md:p-6">
                <CardHeader>
                  <CardTitle className="text-3xl">Vind Ons Hier</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border border-border aspect-w-16 aspect-h-9">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2455.411881581011!2d5.160488977003139!3d52.01403997193248!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c665a60b1110c3%3A0x63f35e5240d6b34!2sWoudmeer%2016%2C%203994%20NE%20Houten%2C%20Netherlands!5e0!3m2!1sen!2sus"
                      className="w-full h-full"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Google Maps Locatie SM Movement"
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}