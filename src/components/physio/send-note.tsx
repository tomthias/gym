"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StickyNote, Loader2, Save, Check, Trash2 } from "lucide-react";

interface Note {
  id: string;
  message: string;
  created_at: string;
}

interface PhysioNotesProps {
  patientId: string;
}

export function SendNote({ patientId }: PhysioNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchNotes = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("physio_notes")
      .select("id, message, created_at")
      .eq("patient_id", patientId)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setNotes(data);
  }, [patientId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSave = useCallback(async () => {
    if (!message.trim()) return;
    setSaving(true);

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

    setSaving(false);

    if (error) {
      alert("Errore nel salvataggio della nota");
      return;
    }

    setMessage("");
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    fetchNotes();
  }, [message, patientId, fetchNotes]);

  const handleDelete = useCallback(
    async (noteId: string) => {
      const supabase = createClient();
      await supabase.from("physio_notes").delete().eq("id", noteId);
      fetchNotes();
    },
    [fetchNotes]
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <StickyNote className="h-4 w-4" />
          Note sul paziente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Existing notes */}
        {notes.length > 0 && (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex items-start justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm whitespace-pre-wrap">{note.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.created_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={() => handleDelete(note.id)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* New note input */}
        <Textarea
          placeholder="Scrivi una nota..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="resize-none"
        />
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!message.trim() || saving}
          className="gap-1.5"
        >
          {saving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : saved ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Save className="h-3.5 w-3.5" />
          )}
          {saved ? "Salvata!" : "Salva nota"}
        </Button>
      </CardContent>
    </Card>
  );
}
