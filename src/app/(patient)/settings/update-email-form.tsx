"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
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
import { useI18n } from "@/lib/i18n/client";

export function UpdateEmailForm({ currentEmail }: { currentEmail: string }) {
  const { t: { settings: { emailForm: t } } } = useI18n();
  const [email, setEmail] = useState(currentEmail);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = email.trim();
    if (trimmed === currentEmail) return;

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ email: trimmed });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    toast.success(t.confirmationSent);
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
            disabled={loading || email.trim() === currentEmail}
            className="w-full"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.submit}
          </Button>
          <p className="text-xs text-muted-foreground">
            {t.confirmationHint}
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
