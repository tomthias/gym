import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, AtSign, Mail, Stethoscope, FileText, ChevronRight } from "lucide-react";
import { LogoutButton } from "./logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UpdateEmailForm } from "./update-email-form";
import { UpdatePasswordForm } from "./update-password-form";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, username, email, physio_id")
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-golden-100">
              <Stethoscope className="h-5 w-5 text-golden-600" />
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

      <UpdateEmailForm currentEmail={profile?.email || user.email || ""} />

      <UpdatePasswordForm />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Documenti</CardTitle>
        </CardHeader>
        <CardContent>
          <Link
            href="/invoices"
            className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
                <FileText className="h-5 w-5 text-teal-600" />
              </div>
              <div>
                <p className="font-medium">Le mie fatture</p>
                <p className="text-sm text-muted-foreground">
                  Visualizza e scarica le fatture
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      <ThemeToggle />

      <LogoutButton />
    </div>
  );
}
