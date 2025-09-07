import { MadeWithDyad } from "@/components/made-with-dyad";
import Link from "next/link";
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Youtube, href: "#", name: "YouTube" },
  ];

  return (
    <footer id="contact" className="bg-background border-t-2 border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-sm">
          {/* Branding Section */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="text-2xl font-bold font-serif text-primary tracking-tight">
              SM Movement
            </Link>
            <p className="text-muted-foreground max-w-xs">
              Exclusiviteit in beweging. Van premium auto's en luxe boten tot meesterlijke detailing en tuning.
            </p>
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="text-muted-foreground hover:text-primary transition-colors">
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Section */}
          <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <h4 className="font-semibold text-base text-foreground font-serif">Navigatie</h4>
              <ul className="space-y-2">
                <li><Link href="/aanbod" className="text-muted-foreground hover:text-primary transition-colors">Aanbod</Link></li>
                <li><Link href="/detailing" className="text-muted-foreground hover:text-primary transition-colors">Detailing</Link></li>
                <li><Link href="/tuning" className="text-muted-foreground hover:text-primary transition-colors">Tuning</Link></li>
                <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-base text-foreground font-serif">Mijn Account</h4>
              <ul className="space-y-2">
                <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Inloggen / Registreren</Link></li>
                <li><Link href="/account/profiel" className="text-muted-foreground hover:text-primary transition-colors">Mijn Profiel</Link></li>
                <li><Link href="/account/afspraken" className="text-muted-foreground hover:text-primary transition-colors">Mijn Afspraken</Link></li>
                <li><Link href="/account/offertes" className="text-muted-foreground hover:text-primary transition-colors">Mijn Offertes</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-base text-foreground font-serif">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Woudmeer 16, Houten</span>
                </li>
                <li className="flex items-start gap-2">
                  <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">+31 6 12345678</span>
                </li>
                <li className="flex items-start gap-2">
                  <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <span className="text-muted-foreground">info@sm-movement.nl</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SM Movement. Alle rechten voorbehouden.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <MadeWithDyad />
          </div>
        </div>
      </div>
    </footer>
  );
};