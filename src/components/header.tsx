"use client";

import Link from "next/link";
import { useScrolled } from "@/hooks/use-scrolled";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";
import { Skeleton } from "./ui/skeleton";

export const Header = () => {
  const scrolled = useScrolled();
  const { profile, isAuthenticated, isLoading } = useAuth();

  const getDashboardLink = () => {
    if (profile?.role === 'admin') {
      return "/admin";
    }
    return "/account/profiel";
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/80 border-b backdrop-blur-lg"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          SM Movement
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/aanbod"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Aanbod
          </Link>
          <Link
            href="/detailing"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Detailing
          </Link>
          <Link
            href="/tuning"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Tuning
          </Link>
          <Link
            href="/contact"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Contact
          </Link>

          {isLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : isAuthenticated ? (
            <Button asChild>
              <Link href={getDashboardLink()}>Mijn Account</Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}