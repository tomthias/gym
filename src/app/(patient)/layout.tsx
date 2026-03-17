import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/layout/bottom-nav";

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let showNutrition = false;
  if (user) {
    const { data: budget } = await supabase
      .from("calorie_budgets")
      .select("patient_id")
      .eq("patient_id", user.id)
      .maybeSingle();
    showNutrition = !!budget;
  }

  return (
    <div className="min-h-dvh bg-background pb-20">
      {children}
      <BottomNav showNutrition={showNutrition} />
    </div>
  );
}
