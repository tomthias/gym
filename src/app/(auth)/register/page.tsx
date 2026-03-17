"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Activity, Loader2, Mail } from "lucide-react";

export default function RegisterPage() {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();

    // Validate username
    if (!username.trim()) {
      setError("Inserisci un nome utente");
      setLoading(false);
      return;
    }
    if (username.trim().length < 3) {
      setError("Il nome utente deve avere almeno 3 caratteri");
      setLoading(false);
      return;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username.trim())) {
      setError("Il nome utente puo contenere solo lettere, numeri e underscore");
      setLoading(false);
      return;
    }

    // Validate invite code
    if (!inviteCode.trim()) {
      setError("Inserisci il codice invito della tua fisioterapista");
      setLoading(false);
      return;
    }

    const { data: invite, error: inviteError } = await supabase
      .from("invite_codes")
      .select("*")
      .eq("code", inviteCode.trim().toUpperCase())
      .is("used_by", null)
      .gt("expires_at", new Date().toISOString())
      .single();

    if (inviteError || !invite) {
      setError("Codice invito non valido o scaduto");
      setLoading(false);
      return;
    }

    const role = invite.role as "patient" | "physio";
    const physioId = role === "patient" ? invite.physio_id : null;

    // Register user — physio_id passed in metadata, handled atomically by DB trigger
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/confirm`,
        data: {
          full_name: fullName,
          username: username.trim().toLowerCase(),
          role,
          physio_id: physioId,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Mark invite code as used
    if (authData.user) {
      const { error: inviteUpdateError } = await supabase
        .from("invite_codes")
        .update({
          used_by: authData.user.id,
          used_at: new Date().toISOString(),
        })
        .eq("code", inviteCode.trim().toUpperCase());

      if (inviteUpdateError) {
        console.error("Errore aggiornamento codice invito:", inviteUpdateError.message);
      }
    }

    setEmailSent(true);
    setLoading(false);
  }

  if (emailSent) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
            <Mail className="h-6 w-6 text-teal-600" />
          </div>
          <CardTitle className="text-2xl">Controlla la tua email</CardTitle>
          <CardDescription>
            Abbiamo inviato un link di conferma a <strong>{email}</strong>.
            Clicca il link nell&apos;email per attivare il tuo account.
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Non hai ricevuto l&apos;email?{" "}
            <Link href="/register" className="text-teal-600 hover:underline" onClick={() => setEmailSent(false)}>
              Riprova
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
          <Activity className="h-6 w-6 text-teal-600" />
        </div>
        <CardTitle className="text-2xl">Registrati</CardTitle>
        <CardDescription>Crea il tuo account Physio-Track</CardDescription>
      </CardHeader>
      <form onSubmit={handleRegister}>
        <CardContent className="space-y-4">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome completo</Label>
            <Input
              id="fullName"
              placeholder="Mario Rossi"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Nome utente</Label>
            <Input
              id="username"
              placeholder="es. mario_rossi"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={30}
              required
            />
            <p className="text-xs text-muted-foreground">
              Solo lettere, numeri e underscore
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="nome@esempio.it"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimo 6 caratteri"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inviteCode">Codice invito</Label>
            <Input
              id="inviteCode"
              placeholder="Es. A3K9F2"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              maxLength={6}
              required
              className="uppercase tracking-widest text-center text-lg"
            />
            <p className="text-xs text-muted-foreground">
              Chiedi il codice alla tua fisioterapista
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-2">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Registrati
          </Button>
          <p className="text-sm text-muted-foreground">
            Hai gia un account?{" "}
            <Link href="/login" className="text-teal-600 hover:underline">
              Accedi
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
