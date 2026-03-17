-- Invoices table for physio billing management
CREATE TABLE public.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  physio_id UUID NOT NULL REFERENCES profiles(id),
  patient_id UUID NOT NULL REFERENCES profiles(id),
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL,
  payment_method TEXT,
  subtotal NUMERIC(10,2) NOT NULL,
  stamp_duty NUMERIC(10,2) DEFAULT 2.00,
  grand_total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'paid')),
  line_items JSONB NOT NULL DEFAULT '[]',
  pdf_storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invoices_patient ON invoices(patient_id, invoice_date DESC);
CREATE INDEX idx_invoices_physio ON invoices(physio_id);

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Physio can fully manage their own invoices
CREATE POLICY "Physios manage own invoices" ON invoices FOR ALL
  USING (physio_id = auth.uid());

-- Patient can only read their own invoices
CREATE POLICY "Patients read own invoices" ON invoices FOR SELECT
  USING (patient_id = auth.uid());
