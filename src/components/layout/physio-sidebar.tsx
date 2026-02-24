"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Dumbbell,
  KeyRound,
  LogOut,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/physio/dashboard", label: "Paziente", icon: LayoutDashboard },
  { href: "/physio/plans/new", label: "Nuova scheda", icon: Dumbbell },
  { href: "/physio/exercises", label: "Esercizi", icon: Activity },
  { href: "/physio/invite", label: "Codice invito", icon: KeyRound },
];

export function PhysioSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <aside className="flex flex-col border-r bg-white w-64 min-h-dvh p-4">
      <div className="flex items-center gap-2 mb-8 px-2">
        <Activity className="h-6 w-6 text-medical-600" />
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
                  ? "bg-medical-50 text-medical-700 font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <Button
        variant="ghost"
        onClick={handleLogout}
        className="mt-auto justify-start gap-2 text-muted-foreground"
      >
        <LogOut className="h-4 w-4" />
        Esci
      </Button>
    </aside>
  );
}
