"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INVITE_CODE_EXPIRY_DAYS } from "@/lib/utils/constants";
import { useInviteCodes } from "@/lib/hooks/use-invite-codes";
import { Copy, KeyRound, Loader2, Plus, Check } from "lucide-react";

export function InviteCodeSection() {
  const { codes, loading, creating, copiedCode, handleCreate, handleCopy } =
    useInviteCodes({ limit: 5 });

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
            onClick={() => handleCreate()}
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
                      <Badge variant="outline">
                        {invite.role === "physio" ? "Fisio" : "Paziente"}
                      </Badge>
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
