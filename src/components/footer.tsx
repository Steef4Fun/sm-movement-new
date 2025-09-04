import { MadeWithDyad } from "@/components/made-with-dyad";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SM Movement. Alle rechten voorbehouden.</p>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <a href="mailto:info@smmovement.nl" className="hover:text-primary transition-colors">info@smmovement.nl</a>
          <MadeWithDyad />
        </div>
      </div>
    </footer>
  );
};