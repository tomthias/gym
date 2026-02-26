"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  Activity,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/physio/dashboard", label: "Paziente", icon: LayoutDashboard },
  { href: "/physio/plans", label: "Schede", icon: Dumbbell },
  { href: "/physio/exercises", label: "Esercizi", icon: Activity },
  { href: "/physio/settings", label: "Impostazioni", icon: Settings },
];

export function PhysioSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col border-r bg-background w-64 min-h-dvh p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Activity className="h-6 w-6 text-teal-600" />
        <span className="font-bold text-lg">Physio-Track</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-teal-50 text-teal-700 font-medium dark:bg-teal-950 dark:text-teal-300"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
