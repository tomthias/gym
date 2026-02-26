"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Header } from "@/components/layout/header";
import { PlanEditor } from "@/components/physio/plan-editor";
import { Loader2 } from "lucide-react";

export default function NewPlanPage() {
  const [patientId, setPatientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: patient } = await supabase
        .from("profiles")
        .select("id")
        .eq("physio_id", user.id)
        .eq("role", "patient")
        .limit(1)
        .maybeSingle();

      if (patient) setPatientId(patient.id);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  if (!patientId) {
    return (
      <div>
        <Header title="Nuova scheda" />
        <div className="px-4 pt-8 text-center text-muted-foreground">
          Nessun paziente collegato
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Nuova scheda" />
      <PlanEditor mode="create" patientId={patientId} />
    </div>
  );
}
