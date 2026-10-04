import { defineMessages } from "../define";

const it = {
  title: "Le mie fatture",
  subtitle: "Fatture caricate dalla tua fisioterapista",
  empty: "Nessuna fattura disponibile",
  number: "N. fattura",
  date: "Data",
  total: "Totale",
  status: "Stato",
  paid: "Pagata",
  unpaid: "Da pagare",
  download: "Scarica PDF",
};

export const invoices = defineMessages<typeof it>({
  it,
  en: {
    title: "My invoices",
    subtitle: "Invoices uploaded by your physio",
    empty: "No invoices available",
    number: "Invoice no.",
    date: "Date",
    total: "Total",
    status: "Status",
    paid: "Paid",
    unpaid: "Unpaid",
    download: "Download PDF",
  },
  fr: {
    title: "Mes factures",
    subtitle: "Factures ajoutées par ta kiné",
    empty: "Aucune facture disponible",
    number: "N° de facture",
    date: "Date",
    total: "Total",
    status: "Statut",
    paid: "Payée",
    unpaid: "À payer",
    download: "Télécharger le PDF",
  },
});
