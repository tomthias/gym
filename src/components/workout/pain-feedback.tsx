"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { getPainColor } from "@/lib/utils/constants";

interface PainFeedbackProps {
  onSubmit: (score: number, notes: string) => void;
  loading?: boolean;
}

export function PainFeedback({ onSubmit, loading }: PainFeedbackProps) {
  const [score, setScore] = useState(1);
  const [notes, setNotes] = useState("");

  const colorClass = getPainColor(score);

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label>Livello di dolore</Label>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Nessuno</span>
          <span className={cn("text-3xl font-bold rounded-full px-4 py-1", colorClass)}>
            {score}
          </span>
          <span className="text-sm text-muted-foreground">Massimo</span>
        </div>
        <Slider
          value={[score]}
          onValueChange={([v]) => setScore(v)}
          min={1}
          max={10}
          step={1}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Note (opzionale)</Label>
        <Textarea
          id="notes"
          placeholder="Come ti sei sentito? Problemi particolari?"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button
        onClick={() => onSubmit(score, notes)}
        className="w-full"
        size="lg"
        disabled={loading}
      >
        Salva feedback
      </Button>
    </div>
  );
}
