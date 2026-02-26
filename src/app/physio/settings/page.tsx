import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Header } from "@/components/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, AtSign, Mail, Users } from "lucide-react";
import { PhysioThemeToggle } from "./theme-toggle";
import { PhysioLogoutButton } from "./logout-button";
import { InviteCodeSection } from "./invite-code-section";

export default async function PhysioSettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, email")
    .eq("id", user.id)
    .single();

  // Get linked patient name
  const { data: patient } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("physio_id", user.id)
    .eq("role", "patient")
    .limit(1)
    .maybeSingle();

  return (
    <div>
      <Header title="Impostazioni" />
      <div className="px-4 pt-4 lg:px-0 lg:pt-0 space-y-6">
        {/* Profile info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Il tuo profilo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                <User className="h-5 w-5 text-teal-600" />
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                <AtSign className="h-5 w-5 text-teal-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Nome utente</p>
                <p className="font-medium truncate">
                  {profile?.username ? `@${profile.username}` : "Non impostato"}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900">
                <Mail className="h-5 w-5 text-teal-600" />
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-golden-100 dark:bg-golden-900">
                <Users className="h-5 w-5 text-golden-600" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">Paziente collegato</p>
                <p className="font-medium truncate">
                  {patient?.full_name || "Nessun paziente"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invite codes */}
        <InviteCodeSection />

        {/* Theme */}
        <PhysioThemeToggle />

        {/* Logout */}
        <PhysioLogoutButton />
      </div>
    </div>
  );
}
