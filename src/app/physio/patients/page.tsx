import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import { PatientsTable } from "@/components/physio/patients-table";

export default async function PatientsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all linked patients
  const { data: patients } = await supabase
    .from("profiles")
    .select("id, full_name, username, email, created_at")
    .eq("physio_id", user.id)
    .eq("role", "patient")
    .order("full_name");

  // Fetch last activity (most recent workout log) for each patient
  const patientIds = patients?.map((p) => p.id) ?? [];
  let lastActivityMap: Record<string, string> = {};

  if (patientIds.length > 0) {
    const { data: logs } = await supabase
      .from("workout_logs")
      .select("patient_id, completed_at")
      .in("patient_id", patientIds)
      .order("completed_at", { ascending: false });

    if (logs) {
      for (const log of logs) {
        if (!lastActivityMap[log.patient_id]) {
          lastActivityMap[log.patient_id] = log.completed_at;
        }
      }
    }
  }

  const patientsWithActivity = (patients ?? []).map((p) => ({
    ...p,
    last_activity: lastActivityMap[p.id] ?? null,
  }));

  return (
    <div>
      <Header title="Pazienti" />
      <div className="px-4 pt-4 lg:px-0 lg:pt-0">
        <PatientsTable patients={patientsWithActivity} />
      </div>
    </div>
  );
}
