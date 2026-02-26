"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquarePlus, Loader2, Send, Check } from "lucide-react";

interface SendNoteProps {
  patientId: string;
}

export function SendNote({ patientId }: SendNoteProps) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = useCallback(async () => {
    if (!message.trim()) return;
    setSending(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("physio_notes").insert({
      physio_id: user.id,
      patient_id: patientId,
      message: message.trim(),
    });

    setSending(false);

    if (error) {
      alert("Errore nell'invio della nota");
      return;
    }

    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 2000);
  }, [message, patientId]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MessageSquarePlus className="h-4 w-4" />
          Invia nota al paziente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder="Es: Bravo, prossima settimana aumentiamo i carichi..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="resize-none"
        />
        <Button
          size="sm"
          onClick={handleSend}
          disabled={!message.trim() || sending}
          className="gap-1.5"
        >
          {sending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : sent ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {sent ? "Inviata!" : "Invia nota"}
        </Button>
      </CardContent>
    </Card>
  );
}
