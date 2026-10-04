"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Dumbbell, Clock, UtensilsCrossed, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/client";

const navItems = [
  { href: "/dashboard", key: "home", icon: LayoutDashboard },
  { href: "/workout", key: "workout", icon: Dumbbell },
  { href: "/history", key: "history", icon: Clock },
  { href: "/nutrition", key: "nutrition", icon: UtensilsCrossed },
  { href: "/settings", key: "profile", icon: User },
] as const;

interface BottomNavProps {
  showNutrition?: boolean;
}

export function BottomNav({ showNutrition = true }: BottomNavProps) {
  const pathname = usePathname();
  const { t } = useI18n();
  const items = showNutrition
    ? navItems
    : navItems.filter((item) => item.href !== "/nutrition");

  return (
    <nav aria-label={t.common.nav.label} className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="flex h-16 items-center justify-around">
        {items.map(({ href, key, icon: Icon }) => {
          const label = t.common.nav[key];
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 h-full px-2 text-xs transition-colors",
                isActive
                  ? "text-teal-600"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} aria-hidden="true" />
              <span className={cn(isActive && "font-medium")}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
