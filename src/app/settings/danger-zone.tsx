"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DeleteAccountDialog } from "./delete-account-dialog";
import { useI18n } from "@/lib/i18n/client";

export function DangerZone({ fullName }: { fullName: string }) {
  const { t } = useI18n();
  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-lg text-destructive">
          {t.settings.dangerZone.title}
        </CardTitle>
        <CardDescription>
          {t.settings.dangerZone.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DeleteAccountDialog fullName={fullName} />
      </CardContent>
    </Card>
  );
}
