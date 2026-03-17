"use client";

import { createClient } from "@/lib/supabase/client";
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
import { Download } from "lucide-react";

interface PatientInvoice {
  id: string;
  invoice_number: string;
  invoice_date: string;
  grand_total: number;
  status: "unpaid" | "paid";
  pdf_storage_path: string;
}

export function PatientInvoiceList({
  invoices,
}: {
  invoices: PatientInvoice[];
}) {
  async function handleDownload(storagePath: string) {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("invoices")
      .createSignedUrl(storagePath, 3600);
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden sm:block rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N. fattura</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Totale</TableHead>
              <TableHead className="text-center">Stato</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium font-mono text-sm">
                  {inv.invoice_number}
                </TableCell>
                <TableCell>
                  {new Date(inv.invoice_date).toLocaleDateString("it-IT", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {inv.grand_total.toFixed(2)} &euro;
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={inv.status === "paid" ? "default" : "secondary"}
                  >
                    {inv.status === "paid" ? "Pagata" : "Da pagare"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDownload(inv.pdf_storage_path)}
                    aria-label="Scarica PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden space-y-3">
        {invoices.map((inv) => (
          <div
            key={inv.id}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="space-y-1 min-w-0">
              <p className="font-mono text-sm font-medium">
                {inv.invoice_number}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(inv.invoice_date).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {inv.grand_total.toFixed(2)} &euro;
                </span>
                <Badge
                  variant={inv.status === "paid" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {inv.status === "paid" ? "Pagata" : "Da pagare"}
                </Badge>
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 h-10 w-10"
              onClick={() => handleDownload(inv.pdf_storage_path)}
              aria-label="Scarica PDF"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
