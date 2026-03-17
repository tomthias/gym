"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  KeyRound,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  UserMinus,
  Users,
} from "lucide-react";
import {
  EditPatientDialog,
  ResetPasswordDialog,
  UnlinkPatientDialog,
} from "./patient-actions";

interface Patient {
  id: string;
  full_name: string;
  username: string | null;
  email: string | null;
  created_at: string;
  last_activity: string | null;
}

function formatRelativeTime(dateStr: string | null): string {
  if (!dateStr) return "Mai";
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Oggi";
  if (diffDays === 1) return "Ieri";
  if (diffDays < 7) return `${diffDays} giorni fa`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? "settimana" : "settimane"} fa`;
  }
  const months = Math.floor(diffDays / 30);
  return `${months} ${months === 1 ? "mese" : "mesi"} fa`;
}

export function PatientsTable({ patients }: { patients: Patient[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [editPatient, setEditPatient] = useState<Patient | null>(null);
  const [resetPatient, setResetPatient] = useState<Patient | null>(null);
  const [unlinkPatient, setUnlinkPatient] = useState<Patient | null>(null);

  const filtered = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      (p.username?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <p className="text-center text-muted-foreground">
          Nessun paziente collegato. Genera un codice invito per aggiungere il
          primo paziente.
        </p>
        <Link href="/physio/settings">
          <Button className="gap-1.5">
            <Plus className="h-4 w-4" />
            Genera codice invito
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Cerca paziente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Registrato il</TableHead>
                <TableHead>Ultima attivita</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((patient) => (
                <TableRow
                  key={patient.id}
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/physio/patients/${patient.id}`)
                  }
                >
                  <TableCell className="font-medium">
                    {patient.full_name}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {patient.username ? `@${patient.username}` : "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {patient.email ?? "—"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(patient.created_at).toLocaleDateString("it-IT", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(patient.last_activity)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          aria-label={`Azioni per ${patient.full_name}`}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem
                          onClick={() => setEditPatient(patient)}
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Modifica
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setResetPatient(patient)}
                        >
                          <KeyRound className="mr-2 h-4 w-4" />
                          Reset password
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => setUnlinkPatient(patient)}
                          className="text-destructive focus:text-destructive"
                        >
                          <UserMinus className="mr-2 h-4 w-4" />
                          Rimuovi
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    Nessun risultato per &quot;{search}&quot;
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {filtered.map((patient) => (
          <Card
            key={patient.id}
            className="cursor-pointer hover:border-teal-300 dark:hover:border-teal-700 transition-colors"
            onClick={() => router.push(`/physio/patients/${patient.id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="font-medium truncate">{patient.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {patient.username ? `@${patient.username}` : ""}
                    {patient.email ? ` · ${patient.email}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ultima attivita: {formatRelativeTime(patient.last_activity)}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      aria-label={`Azioni per ${patient.full_name}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem
                      onClick={() => setEditPatient(patient)}
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Modifica
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setResetPatient(patient)}
                    >
                      <KeyRound className="mr-2 h-4 w-4" />
                      Reset password
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => setUnlinkPatient(patient)}
                      className="text-destructive focus:text-destructive"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Rimuovi
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="text-center py-8 text-muted-foreground">
            Nessun risultato per &quot;{search}&quot;
          </p>
        )}
      </div>

      {/* Action dialogs */}
      {editPatient && (
        <EditPatientDialog
          patient={editPatient}
          open={!!editPatient}
          onClose={() => setEditPatient(null)}
        />
      )}
      {resetPatient && (
        <ResetPasswordDialog
          patient={resetPatient}
          open={!!resetPatient}
          onClose={() => setResetPatient(null)}
        />
      )}
      {unlinkPatient && (
        <UnlinkPatientDialog
          patient={unlinkPatient}
          open={!!unlinkPatient}
          onClose={() => setUnlinkPatient(null)}
        />
      )}
    </>
  );
}
