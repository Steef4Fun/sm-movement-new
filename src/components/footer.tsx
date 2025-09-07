import { MadeWithDyad } from "@/components/made-with-dyad";
import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

export const Footer = () => {
  const socialLinks = [
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Youtube, href: "#", name: "YouTube" },
  ];

  return (
    <footer id="contact" className="bg-secondary border-t-2 border-primary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-semibold text-base text-foreground">Navigatie</h4>
            <ul className="space-y-2">
              <li><Link href="/aanbod" className="text-muted-foreground hover:text-primary transition-colors">Aanbod</Link></li>
              <li><Link href="/detailing" className="text-muted-foreground hover:text-primary transition-colors">Detailing</Link></li>
              <li><Link href="/tuning" className="text-muted-foreground hover:text-primary transition-colors">Tuning</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-base text-foreground">Mijn Account</h4>
            <ul className="space-y-2">
              <li><Link href="/login" className="text-muted-foreground hover:text-primary transition-colors">Inloggen / Registreren</Link></li>
              <li><Link href="/account/profiel" className="text-muted-foreground hover:text-primary transition-colors">Mijn Profiel</Link></li>
              <li><Link href="/account/afspraken" className="text-muted-foreground hover:text-primary transition-colors">Mijn Afspraken</Link></li>
              <li><Link href="/account/offertes" className="text-muted-foreground hover:text-primary transition-colors">Mijn Offertes</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-base text-foreground">Wettelijk</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Algemene Voorwaarden</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacybeleid</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold text-base text-foreground">Volg Ons</h4>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} className="text-muted-foreground hover:text-primary transition-colors">
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
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