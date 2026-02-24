"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold">Qualcosa è andato storto</h1>
        <p className="text-muted-foreground max-w-sm">
          Si è verificato un errore imprevisto. Riprova o torna alla pagina
          principale.
        </p>
        <div className="flex gap-3">
          <Button onClick={reset} variant="outline">
            Riprova
          </Button>
          <Button onClick={() => (window.location.href = "/")}>
            Torna alla home
          </Button>
        </div>
      </div>
    </div>
  );
}
