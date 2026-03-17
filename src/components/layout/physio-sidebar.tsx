"use client";

import { useEffect, useRef, useState } from "react";
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
import { createClient } from "@/lib/supabase/client";

function extractPatientId(pathname: string): string | null {
  const match = pathname.match(/^\/physio\/patients\/([^/]+)/);
  return match ? match[1] : null;
}

export function PhysioSidebar() {
  const pathname = usePathname();
  const patientId = extractPatientId(pathname);
  const [patientName, setPatientName] = useState<string | null>(null);
  const lastFetchedId = useRef<string | null>(null);

  useEffect(() => {
    if (!patientId) {
      setPatientName(null);
      lastFetchedId.current = null;
      return;
    }
    if (patientId === lastFetchedId.current) return;

    lastFetchedId.current = patientId;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", patientId)
      .single()
      .then(({ data }) => {
        if (data) setPatientName(data.full_name);
      });
  }, [patientId]);

  const patientSubItems = patientId
    ? [
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
      ]
    : [];

  return (
    <aside className="flex flex-col border-r bg-background w-64 min-h-dvh p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Activity className="h-6 w-6 text-teal-600" />
        <span className="font-bold text-lg">Physio-Track</span>
      </div>

      <nav className="flex-1 space-y-1">
        {/* Pazienti */}
        <Link
          href="/physio/patients"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            pathname.startsWith("/physio/patients")
              ? "bg-teal-50 text-teal-700 font-medium dark:bg-teal-950 dark:text-teal-300"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Users className="h-4 w-4" />
          Pazienti
        </Link>

        {/* Patient sub-items (contextual) */}
        {patientId && patientSubItems.length > 0 && (
          <div className="ml-3 border-l-2 border-muted pl-3 space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground truncate px-3 py-1.5">
              {patientName ?? "..."}
            </p>
            {patientSubItems.map(({ href, label, icon: Icon, exact }) => {
              const isActive = exact
                ? pathname === href
                : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
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
          </div>
        )}

        <div className="py-2" />

        {/* Esercizi (global) */}
        <Link
          href="/physio/exercises"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            pathname.startsWith("/physio/exercises")
              ? "bg-teal-50 text-teal-700 font-medium dark:bg-teal-950 dark:text-teal-300"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Activity className="h-4 w-4" />
          Esercizi
        </Link>

        {/* Impostazioni */}
        <Link
          href="/physio/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
            pathname.startsWith("/physio/settings")
              ? "bg-teal-50 text-teal-700 font-medium dark:bg-teal-950 dark:text-teal-300"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-4 w-4" />
          Impostazioni
        </Link>
      </nav>
    </aside>
  );
}
