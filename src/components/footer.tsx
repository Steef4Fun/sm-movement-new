import { MadeWithDyad } from "@/components/made-with-dyad";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-muted py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} SM Movement. Alle rechten voorbehouden.</p>
        <p className="mt-2">Neem contact met ons op: info@smmovement.nl</p>
        <div className="mt-4">
          <MadeWithDyad />
        </div>
      </div>
    </footer>
  );
};