"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";
import { locales, localeNames } from "@/lib/i18n/config";
import { setLocale } from "@/lib/i18n/actions";
import { useI18n } from "@/lib/i18n/client";

export function LanguageSelect() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Languages className="h-5 w-5" />
          {t.settings.language}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {locales.map((l) => (
            <Button
              key={l}
              variant="outline"
              size="lg"
              lang={l}
              disabled={isPending}
              aria-pressed={locale === l}
              onClick={() =>
                startTransition(async () => {
                  await setLocale(l);
                  router.refresh();
                })
              }
              className={cn(
                "flex-1 px-2",
                locale === l &&
                  "border-teal-500 bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-300"
              )}
            >
              {localeNames[l]}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
