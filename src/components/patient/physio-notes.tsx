import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface PhysioNote {
  id: string;
  message: string;
  created_at: string;
}

interface PhysioNotesProps {
  notes: PhysioNote[];
  physioName: string | null;
}

export function PhysioNotes({ notes, physioName }: PhysioNotesProps) {
  if (!notes.length) return null;

  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <Card key={note.id} className="border-golden-200 bg-golden-50/50 dark:border-golden-800 dark:bg-golden-950/30">
          <CardContent className="p-3">
            <div className="flex gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-golden-100 dark:bg-golden-900">
                <MessageSquare className="h-4 w-4 text-golden-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xs font-medium text-golden-700 dark:text-golden-400">
                    {physioName || "Il tuo fisioterapista"}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {new Date(note.created_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="text-sm">{note.message}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
