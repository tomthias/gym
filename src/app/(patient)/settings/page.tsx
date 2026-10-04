import { createClient } from "@/lib/supabase/server";
import { getI18n } from "@/lib/i18n/server";
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
import { LanguageSelect } from "@/components/language-select";
import { UpdateProfileForm } from "@/app/settings/update-profile-form";
import { UpdateEmailForm } from "@/app/settings/update-email-form";
import { UpdatePasswordForm } from "./update-password-form";
import { DangerZone } from "@/app/settings/danger-zone";
import Link from "next/link";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { t: { settings: t } } = await getI18n();

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
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.accountInfo}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
              <User className="h-5 w-5 text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t.name}</p>
              <p className="font-medium truncate">
                {profile?.full_name || t.notSet}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
              <AtSign className="h-5 w-5 text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t.username}</p>
              <p className="font-medium truncate">
                {profile?.username ? `@${profile.username}` : t.notSet}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100">
              <Mail className="h-5 w-5 text-teal-600" />
            </div>
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground">{t.email}</p>
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
              <p className="text-sm text-muted-foreground">{t.physio}</p>
              <p className="font-medium truncate">
                {physioName || t.notLinked}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <UpdateProfileForm
        fullName={profile?.full_name ?? ""}
        username={profile?.username ?? null}
      />

      <UpdateEmailForm
        currentEmail={profile?.email || user.email || ""}
        pendingEmail={user.new_email ?? null}
      />

      <UpdatePasswordForm />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.documents}</CardTitle>
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
                <p className="font-medium">{t.myInvoices}</p>
                <p className="text-sm text-muted-foreground">
                  {t.invoicesDescription}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </CardContent>
      </Card>

      <LanguageSelect />

      <ThemeToggle />

      <DangerZone fullName={profile?.full_name ?? ""} />

      <LogoutButton />
    </div>
  );
}
