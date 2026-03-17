"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INVITE_CODE_EXPIRY_DAYS } from "@/lib/utils/constants";
import { useInviteCodes } from "@/lib/hooks/use-invite-codes";
import { Copy, KeyRound, Loader2, Plus, Check } from "lucide-react";

export default function InvitePage() {
  const { codes, loading, creating, copiedCode, handleCreate, handleCopy } =
    useInviteCodes();
  const [newRole, setNewRole] = useState<"patient" | "physio">("patient");

  return (
    <div>
      <Header title="Codice invito" />
      <div className="px-4 pt-4 lg:px-0 lg:pt-0 space-y-4">
        <p className="text-sm text-muted-foreground">
          Genera un codice invito per collegare un nuovo utente. Il codice scade
          dopo {INVITE_CODE_EXPIRY_DAYS} giorni.
        </p>

        <div className="flex gap-2">
          <Select
            value={newRole}
            onValueChange={(v) => setNewRole(v as "patient" | "physio")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="patient">Paziente</SelectItem>
              <SelectItem value="physio">Fisioterapista</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => handleCreate(newRole)}
            disabled={creating}
            className="flex-1 gap-2"
          >
            {creating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            Genera codice
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-teal-500" />
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
                          <Check className="h-4 w-4 text-golden-600" />
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
