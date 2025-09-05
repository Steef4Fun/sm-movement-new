"use client";

import Link from "next/link";
import { User, Calendar, FileText } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AccountSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/account/profiel", icon: User, label: "Mijn Profiel" },
    { href: "/account/afspraken", icon: Calendar, label: "Mijn Afspraken" },
    { href: "/account/offertes", icon: FileText, label: "Mijn Offertes" },
  ];

  return (
    <aside className="hidden md:block">
      <nav className="grid gap-2 text-sm font-medium">
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
    </aside>
  );
}