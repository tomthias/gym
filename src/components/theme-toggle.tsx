"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n/client";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useI18n();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- required by next-themes to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.settings.theme.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setTheme("light")}
            className={cn(
              "flex-1 gap-2",
              theme === "light" &&
                "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
            )}
          >
            <Sun className="h-5 w-5" />
            {t.settings.theme.light}
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setTheme("dark")}
            className={cn(
              "flex-1 gap-2",
              theme === "dark" &&
                "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
            )}
          >
            <Moon className="h-5 w-5" />
            {t.settings.theme.dark}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
