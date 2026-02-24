import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">Pagina non trovata</h1>
        <p className="text-muted-foreground max-w-sm">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>
        <Link href="/">
          <Button>Torna alla home</Button>
        </Link>
      </div>
    </div>
  );
}
