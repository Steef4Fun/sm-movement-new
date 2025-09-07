import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Neem Contact Op
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Heeft u een vraag of wilt u een afspraak maken? We horen graag van
              u.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 lg:gap-24 max-w-6xl mx-auto items-start">
            {/* Column 1: Details */}
            <div className="space-y-8">
              <h2 className="text-3xl font-semibold">Onze Gegevens</h2>
              <div className="flex items-start gap-4">
                <div className="bg-primary text-primary-foreground p-3 rounded-md">
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
                  <p className="text-muted-foreground">info@sm-movement.nl</p>
                </div>
              </div>
            </div>

            {/* Column 2: Map */}
            <div>
              <h2 className="text-3xl font-semibold mb-6">Vind Ons Hier</h2>
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
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}