"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { togglePlanActive, deletePlan } from "@/app/physio/actions";
import { Loader2, Power, PowerOff, Trash2 } from "lucide-react";

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

export function DeletePlanButton({ planId }: { planId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      size="sm"
      variant="ghost"
      className="h-8 text-xs text-destructive"
      disabled={pending}
      onClick={() => {
        if (confirm("Eliminare questa scheda?")) {
          startTransition(() => deletePlan(planId));
        }
      }}
    >
      {pending ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : (
        <Trash2 className="h-3 w-3" />
      )}
    </Button>
  );
}
