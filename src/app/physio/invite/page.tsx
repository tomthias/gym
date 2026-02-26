"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INVITE_CODE_LENGTH, INVITE_CODE_EXPIRY_DAYS } from "@/lib/utils/constants";
import { Copy, KeyRound, Loader2, Plus, Check } from "lucide-react";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // No 0,O,1,I for readability
  let code = "";
  for (let i = 0; i < INVITE_CODE_LENGTH; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

interface InviteCode {
  id: string;
  code: string;
  used_by: string | null;
  used_at: string | null;
  expires_at: string;
  created_at: string;
}

export default function InvitePage() {
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
      .order("created_at", { ascending: false });

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
        code: generateCode(),
        physio_id: user.id,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (error) {
      alert("Errore nella generazione del codice");
      setCreating(false);
      return;
    }

    if (data) setCodes((prev) => [data, ...prev]);
    setCreating(false);
  }, []);

  const handleCopy = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  }, []);

  return (
    <div>
      <Header title="Codice invito" />
      <div className="px-4 pt-4 space-y-4 max-w-lg">
        <p className="text-sm text-muted-foreground">
          Genera un codice invito per collegare il tuo paziente. Il codice scade
          dopo {INVITE_CODE_EXPIRY_DAYS} giorni.
        </p>

        <Button
          onClick={handleCreate}
          disabled={creating}
          className="w-full gap-2"
        >
          {creating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          Genera nuovo codice
        </Button>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-medical-500" />
          </div>
        ) : codes.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12">
            <KeyRound className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Nessun codice generato</p>
          </div>
        ) : (
          <div className="space-y-3">
            {codes.map((invite) => {
              const isExpired = new Date(invite.expires_at) < new Date();
              const isUsed = !!invite.used_by;

              return (
                <Card key={invite.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <p className="font-mono text-2xl font-bold tracking-[0.3em]">
                        {invite.code}
                      </p>
                      <div className="flex items-center gap-2">
                        {isUsed ? (
                          <Badge className="bg-sage-100 text-sage-700">
                            Usato
                          </Badge>
                        ) : isExpired ? (
                          <Badge variant="destructive">Scaduto</Badge>
                        ) : (
                          <Badge variant="secondary">Attivo</Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          Scade:{" "}
                          {new Date(invite.expires_at).toLocaleDateString(
                            "it-IT"
                          )}
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
                          <Check className="h-4 w-4 text-sage-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
