"use client";

import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Upload, AlertTriangle } from "lucide-react";
import { uploadInvoice, saveInvoice } from "@/app/physio/patients/actions";
import type { InvoiceLineItem } from "@/types/database";

interface ParsedData {
  invoice_number: string;
  invoice_date: string;
  payment_method: string | null;
  line_items: InvoiceLineItem[];
  subtotal: number;
  stamp_duty: number;
  grand_total: number;
}

export function InvoiceUpload({ patientId }: { patientId: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [storagePath, setStoragePath] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [error, setError] = useState("");

  // Manual entry fields
  const [manualNumber, setManualNumber] = useState("");
  const [manualDate, setManualDate] = useState("");
  const [manualTotal, setManualTotal] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("patientId", patientId);
    formData.append("file", file);

    try {
      const result = await uploadInvoice(formData);

      setStoragePath(result.storagePath);

      if (result.success && result.parsed) {
        setParsed(result.parsed);
        setShowConfirm(true);
      } else {
        // Parse failed → show manual entry
        setShowManual(true);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel caricamento");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleConfirm() {
    if (!parsed || !storagePath) return;
    setSaving(true);
    try {
      await saveInvoice({
        patientId,
        invoiceNumber: parsed.invoice_number,
        invoiceDate: parsed.invoice_date,
        paymentMethod: parsed.payment_method,
        subtotal: parsed.subtotal,
        stampDuty: parsed.stamp_duty,
        grandTotal: parsed.grand_total,
        lineItems: parsed.line_items,
        pdfStoragePath: storagePath,
      });
      setShowConfirm(false);
      setParsed(null);
      setStoragePath(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  }

  async function handleManualSave() {
    if (!storagePath) return;
    setSaving(true);
    try {
      await saveInvoice({
        patientId,
        invoiceNumber: manualNumber,
        invoiceDate: manualDate,
        paymentMethod: null,
        subtotal: parseFloat(manualTotal) || 0,
        stampDuty: 2,
        grandTotal: (parseFloat(manualTotal) || 0) + 2,
        lineItems: [],
        pdfStoragePath: storagePath,
      });
      setShowManual(false);
      setStoragePath(null);
      setManualNumber("");
      setManualDate("");
      setManualTotal("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore nel salvataggio");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button
        size="sm"
        className="gap-1.5"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        Carica fattura
      </Button>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && !showConfirm && !showManual && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      {/* Confirmation dialog with parsed data */}
      <Dialog open={showConfirm} onOpenChange={(v) => !v && setShowConfirm(false)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Conferma fattura</DialogTitle>
            <DialogDescription>
              Verifica i dati estratti dal PDF
            </DialogDescription>
          </DialogHeader>
          {parsed && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">N. fattura:</span>{" "}
                  <span className="font-medium">{parsed.invoice_number}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Data:</span>{" "}
                  <span className="font-medium">
                    {new Date(parsed.invoice_date).toLocaleDateString("it-IT")}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Pagamento:</span>{" "}
                  <span className="font-medium">
                    {parsed.payment_method ?? "—"}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Sedute:</span>{" "}
                  <span className="font-medium">{parsed.line_items.length}</span>
                </div>
              </div>

              <div className="rounded-lg border max-h-48 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Descrizione</TableHead>
                      <TableHead className="text-right">Tot.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {parsed.line_items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell className="text-sm">
                          {item.description}
                        </TableCell>
                        <TableCell className="text-right text-sm">
                          {item.total.toFixed(2)} €
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="text-right space-y-1 text-sm">
                <p>
                  Totale competenze:{" "}
                  <span className="font-medium">
                    {parsed.subtotal.toFixed(2)} €
                  </span>
                </p>
                <p>
                  Marca da bollo:{" "}
                  <span className="font-medium">
                    {parsed.stamp_duty.toFixed(2)} €
                  </span>
                </p>
                <p className="text-base font-semibold">
                  Totale documento: {parsed.grand_total.toFixed(2)} €
                </p>
              </div>
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              disabled={saving}
            >
              Annulla
            </Button>
            <Button onClick={handleConfirm} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Conferma e salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual entry fallback dialog */}
      <Dialog open={showManual} onOpenChange={(v) => !v && setShowManual(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Inserimento manuale
            </DialogTitle>
            <DialogDescription>
              Non e stato possibile leggere la fattura automaticamente. Il PDF e
              stato caricato, inserisci i dati manualmente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="manual-number">Numero fattura</Label>
              <Input
                id="manual-number"
                placeholder="es. FT-27-2026-E"
                value={manualNumber}
                onChange={(e) => setManualNumber(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-date">Data</Label>
              <Input
                id="manual-date"
                type="date"
                value={manualDate}
                onChange={(e) => setManualDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manual-total">Totale competenze (€)</Label>
              <Input
                id="manual-total"
                type="number"
                step="0.01"
                placeholder="es. 401.00"
                value={manualTotal}
                onChange={(e) => setManualTotal(e.target.value)}
              />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowManual(false)}
              disabled={saving}
            >
              Annulla
            </Button>
            <Button
              onClick={handleManualSave}
              disabled={saving || !manualNumber || !manualDate || !manualTotal}
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salva
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
