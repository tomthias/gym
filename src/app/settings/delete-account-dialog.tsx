"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { deleteAccount } from "./actions";

export function DeleteAccountDialog({ fullName }: { fullName: string }) {
  const router = useRouter();
  const [confirmName, setConfirmName] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const canConfirm =
    confirmName.trim().toLowerCase() === fullName.toLowerCase();

  async function handleDelete() {
    setLoading(true);
    try {
      const result = await deleteAccount();
      if (!result.success) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/login");
    } catch {
      toast.error("Errore imprevisto");
      setLoading(false);
    }
  }

  function handleOpenChange(v: boolean) {
    if (!v) setConfirmName("");
    setOpen(v);
  }

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          Elimina account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Elimina account</AlertDialogTitle>
          <AlertDialogDescription>
            Questa azione è irreversibile. Il tuo account e tutti i dati
            associati verranno eliminati definitivamente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-2 py-2">
          <Label htmlFor="confirm-delete-name">
            Scrivi{" "}
            <span className="font-medium">{fullName}</span> per confermare
          </Label>
          <Input
            id="confirm-delete-name"
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={fullName}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Annulla</AlertDialogCancel>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={!canConfirm || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Elimina definitivamente
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
