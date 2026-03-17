"use client";

import { use } from "react";
import { Header } from "@/components/layout/header";
import { PlanEditor } from "@/components/physio/plan-editor";

interface Props {
  params: Promise<{ patientId: string }>;
}

export default function NewPatientPlanPage({ params }: Props) {
  const { patientId } = use(params);

  return (
    <div>
      <Header title="Nuova scheda" backHref={`/physio/patients/${patientId}/plans`} />
      <PlanEditor
        mode="create"
        patientId={patientId}
        redirectPath={`/physio/patients/${patientId}/plans`}
      />
    </div>
  );
}
