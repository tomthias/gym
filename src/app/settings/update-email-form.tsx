"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateEmail } from "./actions";
import { useI18n } from "@/lib/i18n/client";

export function UpdateEmailForm({
  currentEmail,
}: {
  currentEmail: string;
  pendingEmail?: string | null;
}) {
  const { t: { settings: { emailForm: t } } } = useI18n();
  const [email, setEmail] = useState(currentEmail);
  const [savedEmail, setSavedEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();
    if (trimmed === savedEmail) return;

    setLoading(true);
    const result = await updateEmail(trimmed);

    if (!result.success) {
      toast.error(result.error);
      setLoading(false);
      return;
    }

    toast.success(t.updated);
    setSavedEmail(trimmed);
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{t.title}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-email">{t.newEmail}</Label>
            <Input
              id="new-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading || email.trim() === savedEmail}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.submit}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
