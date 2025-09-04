import Link from "next/link";

export const Header = () => {
  return (
    <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          SM Movement
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link href="/aanbod" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Aanbod
          </Link>
          <Link href="/detailing" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Detailing
          </Link>
          <Link href="/tuning" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Tuning
          </Link>
          <Link href="/contact" className="text-sm font-medium text-primary hover:underline underline-offset-4">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
};