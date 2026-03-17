"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Users,
  LayoutDashboard,
  Dumbbell,
  FileText,
  Activity,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

function extractPatientId(pathname: string): string | null {
  const match = pathname.match(/^\/physio\/patients\/([^/]+)/);
  return match ? match[1] : null;
}

export function PhysioMobileNav() {
  const pathname = usePathname();
  const patientId = extractPatientId(pathname);

  // Patient context mode: Dashboard, Schede, Fatture
  if (patientId) {
    const patientItems = [
      {
        href: `/physio/patients/${patientId}`,
        label: "Dashboard",
        icon: LayoutDashboard,
        exact: true,
      },
      {
        href: `/physio/patients/${patientId}/plans`,
        label: "Schede",
        icon: Dumbbell,
      },
      {
        href: `/physio/patients/${patientId}/invoices`,
        label: "Fatture",
        icon: FileText,
      },
    ];

    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="flex h-16 items-center justify-around">
          {patientItems.map(({ href, label, icon: Icon, exact }) => {
            const isActive = exact
              ? pathname === href
              : pathname.startsWith(href);
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
                <Icon
                  className={cn("h-5 w-5", isActive && "stroke-[2.5]")}
                />
                <span className={cn(isActive && "font-medium")}>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }

  // Global mode: Pazienti, Esercizi, Impostazioni
  const globalItems = [
    { href: "/physio/patients", label: "Pazienti", icon: Users },
    { href: "/physio/exercises", label: "Esercizi", icon: Activity },
    { href: "/physio/settings", label: "Profilo", icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="flex h-16 items-center justify-around">
        {globalItems.map(({ href, label, icon: Icon }) => {
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
