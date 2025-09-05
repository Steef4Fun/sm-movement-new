"use client";

import Link from "next/link";
import {
  Home,
  Car,
  Users,
  Calendar,
  FileText,
  Package2,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", icon: Home, label: "Overzicht" },
    { href: "/admin/aanbod", icon: Car, label: "Aanbodbeheer" },
    { href: "/admin/afspraken", icon: Calendar, label: "Afsprakenbeheer" },
    { href: "/admin/offertes", icon: FileText, label: "Offertebeheer" },
    { href: "/admin/gebruikers", icon: Users, label: "Gebruikersbeheer" },
  ];

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">SM Movement</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname === item.href && "bg-muted text-primary"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}