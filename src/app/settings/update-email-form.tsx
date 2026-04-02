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
import { Loader2, Clock } from "lucide-react";
import { toast } from "sonner";

export function UpdateEmailForm({
  currentEmail,
  pendingEmail,
}: {
  currentEmail: string;
  pendingEmail?: string | null;
}) {
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

    toast.success("Email di conferma inviata al nuovo indirizzo");
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Modifica email</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {pendingEmail && (
            <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 dark:border-amber-800 dark:bg-amber-950">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Conferma in attesa per:{" "}
                <span className="font-medium">{pendingEmail}</span>. Controlla
                la tua casella email.
              </p>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="new-email">Nuova email</Label>
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
            Aggiorna email
          </Button>
          <p className="text-xs text-muted-foreground">
            Riceverai un&apos;email di conferma al nuovo indirizzo.
          </p>
        </CardContent>
      </form>
    </Card>
  );
}
