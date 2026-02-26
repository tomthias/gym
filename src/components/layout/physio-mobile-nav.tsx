"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, Activity, KeyRound } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/physio/dashboard", label: "Paziente", icon: LayoutDashboard },
  { href: "/physio/plans/new", label: "Scheda", icon: Dumbbell },
  { href: "/physio/exercises", label: "Esercizi", icon: Activity },
  { href: "/physio/invite", label: "Invito", icon: KeyRound },
];

export function PhysioMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors",
                isActive
                  ? "text-teal-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className={cn(isActive && "font-medium")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
