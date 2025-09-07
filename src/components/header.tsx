"use client";

import Link from "next/link";
import { useState } from "react";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "./ui/skeleton";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";

const navItems = [
  { href: "/aanbod", label: "Aanbod" },
  { href: "/detailing", label: "Detailing" },
  { href: "/tuning", label: "Tuning" },
  { href: "/contact", label: "Contact" },
];

export const Header = () => {
  const scrolled = useScrolled();
  const { profile, isAuthenticated, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (profile?.role === 'admin') {
      return "/admin";
    }
    return "/account/profiel";
  };

  const AuthButton = ({ className }: { className?: string }) => (
    <div className={cn("w-32 flex justify-end", className)}>
      {isLoading ? (
        <Skeleton className="h-10 w-full" />
      ) : isAuthenticated ? (
        <Button asChild className="w-full">
          <Link href={getDashboardLink()}>Mijn Account</Link>
        </Button>
      ) : (
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Login</Link>
        </Button>
      )}
    </div>
  );

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 border-b border-border/50 backdrop-blur-lg"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop Header */}
        <div className="hidden md:grid h-20 grid-cols-3 items-center">
          <Link href="/" className="text-2xl font-bold font-serif text-primary tracking-tight">
            SM Movement
          </Link>

          <nav className="flex items-center justify-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors duration-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="justify-self-end">
            <AuthButton />
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold font-serif text-primary tracking-tight">
            SM Movement
          </Link>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background">
              <nav className="flex flex-col gap-6 text-lg mt-12">
                {navItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      className="font-medium text-foreground/80 hover:text-primary transition-colors duration-300"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
              <div className="absolute bottom-8 left-8 right-8">
                <AuthButton className="w-full" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};