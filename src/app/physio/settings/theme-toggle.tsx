"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PhysioThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Tema</CardTitle>
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
            Chiaro
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
            Scuro
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
