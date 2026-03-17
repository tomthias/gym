"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Copy, Loader2 } from "lucide-react";
import {
  editPatient,
  resetPatientPassword,
  unlinkPatient,
} from "@/app/physio/patients/actions";

interface Patient {
  id: string;
  full_name: string;
  username: string | null;
  email: string | null;
}

// --- Edit Patient Dialog ---

export function EditPatientDialog({
  patient,
  open,
  onClose,
}: {
  patient: Patient;
  open: boolean;
  onClose: () => void;
}) {
  const [fullName, setFullName] = useState(patient.full_name);
  const [username, setUsername] = useState(patient.username ?? "");
  const [email, setEmail] = useState(patient.email ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const emailChanged = email !== (patient.email ?? "");

  async function handleSave() {
    setError("");
    setSaving(true);
    try {
      await editPatient(patient.id, { fullName, username, email });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifica paziente</DialogTitle>
          <DialogDescription>
            Aggiorna i dati di {patient.full_name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
          <div className="space-y-2">
            <Label htmlFor="edit-fullname">Nome completo</Label>
            <Input
              id="edit-fullname"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-username">Username</Label>
            <Input
              id="edit-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-email">Email</Label>
            <Input
              id="edit-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailChanged && (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                L&apos;email e anche l&apos;indirizzo di accesso del paziente.
                Modificandola cambieranno le credenziali di login.
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salva
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --- Reset Password Dialog ---

export function ResetPasswordDialog({
  patient,
  open,
  onClose,
}: {
  patient: Patient;
  open: boolean;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"confirm" | "result">("confirm");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  async function handleReset() {
    setError("");
    setLoading(true);
    try {
      const newPassword = await resetPatientPassword(patient.id);
      setPassword(newPassword);
      setStep("result");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel reset");
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleClose() {
    setStep("confirm");
    setPassword("");
    setCopied(false);
    setError("");
    onClose();
  }

  if (step === "result") {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuova password generata</DialogTitle>
            <DialogDescription>
              Comunica questa password al paziente. Non sara piu visibile dopo
              la chiusura.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-4">
            <code className="flex-1 rounded-lg border bg-muted px-4 py-3 font-mono text-lg tracking-wider text-center select-all">
              {password}
            </code>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 h-12 w-12"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-5 w-5 text-teal-600" />
              ) : (
                <Copy className="h-5 w-5" />
              )}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={handleClose}>Chiudi</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reset password</AlertDialogTitle>
          <AlertDialogDescription>
            Vuoi generare una nuova password per{" "}
            <span className="font-medium">{patient.full_name}</span>? La
            password attuale sara sostituita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annulla</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Genera nuova password
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// --- Unlink Patient Dialog ---

export function UnlinkPatientDialog({
  patient,
  open,
  onClose,
}: {
  patient: Patient;
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [confirmName, setConfirmName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canConfirm =
    confirmName.trim().toLowerCase() === patient.full_name.toLowerCase();

  async function handleUnlink() {
    setError("");
    setLoading(true);
    try {
      await unlinkPatient(patient.id);
      onClose();
      router.push("/physio/patients");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nella rimozione");
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setConfirmName("");
    setError("");
    onClose();
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Rimuovi paziente</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>
              Il paziente verra rimosso dalla tua lista ma il suo account
              restera attivo. Non potrai piu accedere ai suoi dati.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="confirm-name">
            Scrivi <span className="font-medium">{patient.full_name}</span> per
            confermare
          </Label>
          <Input
            id="confirm-name"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={patient.full_name}
          />
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading} onClick={handleClose}>
            Annulla
          </AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleUnlink}
            disabled={!canConfirm || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Rimuovi paziente
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
