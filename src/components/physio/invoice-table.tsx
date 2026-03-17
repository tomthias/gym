"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  ChevronDown,
  ChevronUp,
  Download,
  FileText,
  Loader2,
  Trash2,
} from "lucide-react";
import { deleteInvoice, toggleInvoiceStatus } from "@/app/physio/patients/actions";
import { createClient } from "@/lib/supabase/client";
import type { InvoiceLineItem } from "@/types/database";

interface Invoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  payment_method: string | null;
  subtotal: number;
  stamp_duty: number;
  grand_total: number;
  status: "unpaid" | "paid";
  line_items: InvoiceLineItem[];
  pdf_storage_path: string;
  created_at: string;
}

export function InvoiceTable({ invoices }: { invoices: Invoice[] }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  async function handleDownload(storagePath: string) {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("invoices")
      .createSignedUrl(storagePath, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteInvoice(deleteId);
    } catch {
      // Error handling via revalidation
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  }

  async function handleToggleStatus(invoiceId: string) {
    setToggling(invoiceId);
    try {
      await toggleInvoiceStatus(invoiceId);
    } catch {
      // Error handling via revalidation
    } finally {
      setToggling(null);
    }
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12">
        <FileText className="h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Nessuna fattura caricata
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8" />
              <TableHead>N. fattura</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-center">Sedute</TableHead>
              <TableHead className="text-right">Totale</TableHead>
              <TableHead className="text-center">Stato</TableHead>
              <TableHead className="w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => {
              const isExpanded = expandedId === invoice.id;
              const lineItems = (invoice.line_items ?? []) as InvoiceLineItem[];
              return (
                <>
                  <TableRow
                    key={invoice.id}
                    className="cursor-pointer"
                    onClick={() =>
                      setExpandedId(isExpanded ? null : invoice.id)
                    }
                  >
                    <TableCell>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="font-medium font-mono text-sm">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.invoice_date).toLocaleDateString(
                        "it-IT",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {lineItems.length}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {invoice.grand_total.toFixed(2)} €
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className="cursor-pointer"
                        variant={
                          invoice.status === "paid" ? "default" : "secondary"
                        }
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStatus(invoice.id);
                        }}
                      >
                        {toggling === invoice.id ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : invoice.status === "paid" ? (
                          "Pagata"
                        ) : (
                          "Da pagare"
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className="flex gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleDownload(invoice.pdf_storage_path)
                          }
                          aria-label="Scarica PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(invoice.id)}
                          aria-label="Elimina fattura"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {isExpanded && lineItems.length > 0 && (
                    <TableRow key={`${invoice.id}-detail`}>
                      <TableCell colSpan={7} className="bg-muted/30 p-4">
                        <div className="space-y-2">
                          <p className="text-xs font-medium text-muted-foreground uppercase">
                            Dettaglio prestazioni
                          </p>
                          <div className="rounded border bg-background">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Descrizione</TableHead>
                                  <TableHead className="text-right">
                                    Prezzo
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Sconto
                                  </TableHead>
                                  <TableHead className="text-right">
                                    Totale
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {lineItems.map((item, i) => (
                                  <TableRow key={i}>
                                    <TableCell className="text-sm">
                                      {item.description}
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                      {item.unit_price.toFixed(2)} €
                                    </TableCell>
                                    <TableCell className="text-right text-sm">
                                      {item.discount_percent > 0
                                        ? `${item.discount_percent}%`
                                        : "—"}
                                    </TableCell>
                                    <TableCell className="text-right text-sm font-medium">
                                      {item.total.toFixed(2)} €
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          <div className="text-right text-sm space-y-0.5 pt-1">
                            <p className="text-muted-foreground">
                              Totale competenze:{" "}
                              <span className="font-medium text-foreground">
                                {invoice.subtotal.toFixed(2)} €
                              </span>
                            </p>
                            <p className="text-muted-foreground">
                              Marca da bollo:{" "}
                              <span className="font-medium text-foreground">
                                {invoice.stamp_duty.toFixed(2)} €
                              </span>
                            </p>
                            <p className="font-semibold">
                              Totale documento: {invoice.grand_total.toFixed(2)}{" "}
                              €
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Delete confirmation */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(v) => !v && setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Elimina fattura</AlertDialogTitle>
            <AlertDialogDescription>
              Sei sicuro di voler eliminare questa fattura? Il PDF verra rimosso.
              Questa azione non puo essere annullata.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Elimina
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
