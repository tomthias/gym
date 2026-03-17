import type { InvoiceLineItem } from "@/types/database";
import path from "path";

// Polyfill DOMMatrix for Node.js (pdfjs-dist requires it but we only extract text)
if (typeof globalThis.DOMMatrix === "undefined") {
  // @ts-expect-error minimal polyfill for pdfjs-dist text extraction
  globalThis.DOMMatrix = class DOMMatrix {
    constructor(init?: number[] | string) {
      const m = init && Array.isArray(init) ? init : [1, 0, 0, 1, 0, 0];
      this.a = m[0] ?? 1; this.b = m[1] ?? 0;
      this.c = m[2] ?? 0; this.d = m[3] ?? 1;
      this.e = m[4] ?? 0; this.f = m[5] ?? 0;
    }
    a: number; b: number; c: number; d: number; e: number; f: number;
    isIdentity = false;
    is2D = true;
    inverse() { return new DOMMatrix(); }
    multiply() { return new DOMMatrix(); }
    scale() { return new DOMMatrix(); }
    translate() { return new DOMMatrix(); }
    transformPoint() { return { x: 0, y: 0, z: 0, w: 1 }; }
  };
}

export interface ParsedInvoice {
  invoice_number: string;
  invoice_date: string; // ISO date YYYY-MM-DD
  payment_method: string | null;
  line_items: InvoiceLineItem[];
  subtotal: number;
  stamp_duty: number;
  grand_total: number;
}

function parseItalianNumber(str: string): number {
  // "64.80" or "64,80" → 64.80
  return parseFloat(str.replace(",", "."));
}

function parseItalianDate(dateStr: string): string {
  // DD/MM/YYYY → YYYY-MM-DD
  const parts = dateStr.split("/");
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
}

async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  // Use pdfjs-dist directly (more compatible with Vercel serverless than pdf-parse)
  const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

  // Resolve pdfjs-dist package directory for worker and fonts
  let pkgDir: string | undefined;
  try {
    const resolved = require.resolve("pdfjs-dist/package.json");
    if (typeof resolved === "string") {
      pkgDir = path.dirname(resolved);
    }
  } catch {
    // fallback: try common node_modules path
  }
  if (!pkgDir) {
    pkgDir = path.join(process.cwd(), "node_modules", "pdfjs-dist");
  }

  // Point worker to the actual file so pdfjs-dist works in Node.js / Vercel serverless
  pdfjsLib.GlobalWorkerOptions.workerSrc = path.join(
    pkgDir,
    "legacy/build/pdf.worker.mjs"
  );

  // standardFontDataUrl is optional
  let standardFontDataUrl: string | undefined;
  try {
    standardFontDataUrl = path.join(pkgDir, "standard_fonts/");
  } catch {
    // not available in this environment, continue without it
  }

  const doc = await pdfjsLib.getDocument({
    data: new Uint8Array(buffer),
    ...(standardFontDataUrl ? { standardFontDataUrl } : {}),
  }).promise;

  let fullText = "";
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();

    // Collect items with their position (PDF y=0 is at the bottom)
    const items: { str: string; x: number; y: number }[] = [];
    for (const item of content.items) {
      if (!("str" in item) || item.str.trim() === "") continue;
      items.push({
        str: item.str,
        x: item.transform[4],
        y: item.transform[5],
      });
    }

    // Sort top-to-bottom (y descending), then left-to-right (x ascending)
    items.sort((a, b) => b.y - a.y || a.x - b.x);

    // Group items that share the same visual line (Y within 5 units)
    const Y_TOLERANCE = 5;
    const lines: { str: string; x: number }[][] = [];
    let currentLine: { str: string; x: number; y: number }[] = [];
    let lineRefY: number | null = null;

    for (const item of items) {
      if (lineRefY === null || Math.abs(item.y - lineRefY) <= Y_TOLERANCE) {
        currentLine.push(item);
        if (lineRefY === null) lineRefY = item.y;
      } else {
        currentLine.sort((a, b) => a.x - b.x);
        lines.push(currentLine);
        currentLine = [item];
        lineRefY = item.y;
      }
    }
    if (currentLine.length > 0) {
      currentLine.sort((a, b) => a.x - b.x);
      lines.push(currentLine);
    }

    for (const line of lines) {
      fullText += line.map((i) => i.str).join(" ") + "\n";
    }
  }

  return fullText;
}

export async function parseInvoicePdf(buffer: Buffer): Promise<ParsedInvoice> {
  const text = await extractTextFromPdf(buffer);

  // Invoice number: FT-XX-YYYY-E
  const invoiceNumberMatch = text.match(/(FT-\d+-\d+-\w)/);
  if (!invoiceNumberMatch) {
    throw new Error("Numero fattura non trovato");
  }
  const invoice_number = invoiceNumberMatch[1];

  // Invoice date: "Del: DD/MM/YYYY" or "del DD/MM/YYYY"
  const dateMatch = text.match(/[Dd]el[:\s]+(\d{2}\/\d{2}\/\d{4})/);
  if (!dateMatch) {
    throw new Error("Data fattura non trovata");
  }
  const invoice_date = parseItalianDate(dateMatch[1]);

  // Payment method: "Pagamento: Bonifico"
  const paymentMatch = text.match(/Pagamento[:\s]+(\w+)/i);
  const payment_method = paymentMatch ? paymentMatch[1] : null;

  // Line items: rows with description, quantity, unit price, discount, total
  // Pattern: "Fisioterapia del DD/MM/YYYY 1.00 72.00 10.00 64.80"
  // or "Valutazione Fisioterapica del DD/MM/YYYY 1.00 77.00 0.00 77.00"
  const lineItemRegex =
    /(.+?del\s+(\d{2}\/\d{2}\/\d{4}))\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)\s+([\d.,]+)/g;

  const line_items: InvoiceLineItem[] = [];
  let match;
  while ((match = lineItemRegex.exec(text)) !== null) {
    line_items.push({
      description: match[1].trim(),
      session_date: parseItalianDate(match[2]),
      quantity: parseItalianNumber(match[3]),
      unit_price: parseItalianNumber(match[4]),
      discount_percent: parseItalianNumber(match[5]),
      total: parseItalianNumber(match[6]),
    });
  }

  if (line_items.length === 0) {
    throw new Error("Nessuna riga trovata nella fattura");
  }

  // Totals
  const subtotalMatch = text.match(
    /Totale\s+competenze[:\s]*([\d.,]+)/i
  );
  const subtotal = subtotalMatch
    ? parseItalianNumber(subtotalMatch[1])
    : line_items.reduce((s, item) => s + item.total, 0);

  const stampMatch = text.match(/Marca\s+da\s+bollo[:\s]*([\d.,]+)/i);
  const stamp_duty = stampMatch ? parseItalianNumber(stampMatch[1]) : 2.0;

  const grandTotalMatch = text.match(
    /Totale\s+documento[:\s]*([\d.,]+)/i
  );
  const grand_total = grandTotalMatch
    ? parseItalianNumber(grandTotalMatch[1])
    : subtotal + stamp_duty;

  return {
    invoice_number,
    invoice_date,
    payment_method,
    line_items,
    subtotal,
    stamp_duty,
    grand_total,
  };
}
