import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Stethoscope } from "lucide-react";
import { LogoutButton } from "./logout-button";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, physio_id")
    .eq("id", user.id)
    .single();

  // Fetch linked physio name if exists
  let physioName: string | null = null;
  if (profile?.physio_id) {
    const { data: physio } = await supabase
      .from("profiles")
      .select("full_name")
      .eq("id", profile.physio_id)
      .single();
    physioName = physio?.full_name ?? null;
  }

  return (
    <div className="px-4 pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profilo</h1>
        <p className="text-muted-foreground">Le tue informazioni personali</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informazioni account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-medical-100">
              <User className="h-5 w-5 text-medical-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Nome</p>
              <p className="font-medium truncate">
                {profile?.full_name || "Non impostato"}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-medical-100">
              <Mail className="h-5 w-5 text-medical-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium truncate">
                {profile?.email || user.email}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage-100">
              <Stethoscope className="h-5 w-5 text-sage-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">Fisioterapista</p>
              <p className="font-medium truncate">
                {physioName || "Non collegato"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <LogoutButton />
    </div>
  );
}
