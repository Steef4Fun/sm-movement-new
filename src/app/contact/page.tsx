import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ContactForm } from "@/components/contact-form";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Neem Contact Op
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Heeft u een vraag of wilt u een afspraak maken? We horen graag van
              u.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="space-y-8">
              <h2 className="text-2xl font-semibold">Onze Gegevens</h2>
              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-md">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Locatie</h3>
                  <p className="text-muted-foreground">
                    Voorbeeldstraat 123, 1234 AB, Amsterdam
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-md">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Telefoon</h3>
                  <p className="text-muted-foreground">+31 6 12345678</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-md">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold">E-mail</h3>
                  <p className="text-muted-foreground">info@smmovement.nl</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-8">Stuur ons een bericht</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}