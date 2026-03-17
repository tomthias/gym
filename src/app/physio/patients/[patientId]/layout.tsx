import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function PatientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Verify this patient belongs to the current physio
  const { data: patient } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", patientId)
    .eq("physio_id", user.id)
    .eq("role", "patient")
    .single();

  if (!patient) redirect("/physio/patients");

  return <>{children}</>;
}
