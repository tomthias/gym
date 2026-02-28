"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INVITE_CODE_EXPIRY_DAYS } from "@/lib/utils/constants";
import { generateInviteCode, type InviteCode } from "@/lib/utils/invite";
import { Copy, KeyRound, Loader2, Plus, Check } from "lucide-react";
import { toast } from "sonner";

export function InviteCodeSection() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchCodes = useCallback(async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("physio_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) setCodes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleCreate = useCallback(async () => {
    setCreating(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + INVITE_CODE_EXPIRY_DAYS);

    const { data, error } = await supabase
      .from("invite_codes")
      .insert({
        code: generateInviteCode(),
        physio_id: user.id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      toast.error("Errore nella generazione del codice");
      setCreating(false);
      return;
    }

    if (data) setCodes((prev) => [data, ...prev].slice(0, 5));
    setCreating(false);
  }, []);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <KeyRound className="h-5 w-5" />
            Codici invito
          </CardTitle>
          <Button
            size="sm"
            onClick={handleCreate}
            disabled={creating}
            className="gap-1.5"
          >
            {creating ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
            Genera
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Condividi un codice con il tuo paziente. Scade dopo {INVITE_CODE_EXPIRY_DAYS} giorni.
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-5 w-5 animate-spin text-teal-500" />
          </div>
        ) : codes.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nessun codice generato
          </p>
        ) : (
          <div className="space-y-3">
            {codes.map((invite) => {
              const isExpired = new Date(invite.expires_at) < new Date();
              const isUsed = !!invite.used_by;

              return (
                <div
                  key={invite.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <p className="font-mono text-lg font-bold tracking-[0.2em]">
                      {invite.code}
                    </p>
                    <div className="flex items-center gap-2">
                      {isUsed ? (
                        <Badge className="bg-golden-100 text-golden-700">
                          Usato
                        </Badge>
                      ) : isExpired ? (
                        <Badge variant="destructive">Scaduto</Badge>
                      ) : (
                        <Badge variant="secondary">Attivo</Badge>
                      )}
                      <span className="text-xs text-muted-foreground">
                        {new Date(invite.expires_at).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                  </div>
                  {!isUsed && !isExpired && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleCopy(invite.code)}
                    >
                      {copiedCode === invite.code ? (
                        <Check className="h-4 w-4 text-golden-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
