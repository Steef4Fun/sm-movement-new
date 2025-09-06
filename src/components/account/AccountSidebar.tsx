"use client";

import Link from "next/link";
import { User, Calendar, FileText, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export function AccountSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const navItems = [
    { href: "/account/profiel", icon: User, label: "Mijn Profiel" },
    { href: "/account/afspraken", icon: Calendar, label: "Mijn Afspraken" },
    { href: "/account/offertes", icon: FileText, label: "Mijn Offertes" },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="hidden md:flex flex-col justify-between h-full">
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
      <div className="mt-auto">
        <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-3" />
          Uitloggen
        </Button>
      </div>
    </aside>
  );
}