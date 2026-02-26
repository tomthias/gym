"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { togglePlanActive, deletePlan, duplicatePlan } from "@/app/physio/actions";
import { Copy, Loader2, Power, PowerOff, Trash2 } from "lucide-react";

export function TogglePlanButton({
  planId,
  active,
}: {
  planId: string;
  active: boolean;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant={active ? "ghost" : "outline"}
      className={`h-8 text-xs gap-1 ${active ? "text-destructive" : ""}`}
      disabled={pending}
      onClick={() =>
        startTransition(() => togglePlanActive(planId, !active))
      }
    >
      {pending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : active ? (
        <PowerOff className="h-3 w-3" />
      ) : (
        <Power className="h-3 w-3" />
      )}
      {active ? "Disattiva" : "Attiva"}
    </Button>
  );
}

export function DuplicatePlanButton({ planId }: { planId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-8"
      disabled={pending}
      onClick={() => startTransition(() => duplicatePlan(planId))}
      title="Duplica scheda"
    >
      {pending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

export function DeletePlanButton({ planId }: { planId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-destructive"
          disabled={pending}
        >
          {pending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminare questa scheda?</AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione non può essere annullata. La scheda e tutti i suoi
            esercizi verranno eliminati definitivamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annulla</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={() => startTransition(() => deletePlan(planId))}
          >
            Elimina
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
