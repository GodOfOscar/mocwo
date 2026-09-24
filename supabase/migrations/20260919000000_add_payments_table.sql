-- Add a dedicated payment ledger for partnership payments while preserving existing data.
ALTER TABLE public.partnerships
  ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS activated_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partnership_id UUID REFERENCES public.partnerships(id) ON DELETE CASCADE,
  user_id UUID,
  transaction_id TEXT,
  payment_reference TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GHS',
  payment_method TEXT,
  gateway TEXT NOT NULL DEFAULT 'libertepay',
  status TEXT NOT NULL DEFAULT 'pending',
  gateway_response JSONB,
  failure_reason TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create payment records" ON public.payments;
CREATE POLICY "Anyone can create payment records"
  ON public.payments
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view payment records" ON public.payments;
CREATE POLICY "Admins can view payment records"
  ON public.payments
  FOR SELECT
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

DROP POLICY IF EXISTS "Admins can update payment records" ON public.payments;
CREATE POLICY "Admins can update payment records"
  ON public.payments
  FOR UPDATE
  USING (auth.uid() IN (SELECT auth.uid() FROM public.admin_users WHERE email = auth.email()));

CREATE UNIQUE INDEX IF NOT EXISTS payments_payment_reference_unique
  ON public.payments (payment_reference);

CREATE INDEX IF NOT EXISTS payments_partnership_id_idx
  ON public.payments (partnership_id);

CREATE INDEX IF NOT EXISTS payments_status_idx
  ON public.payments (status);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_payments_updated_at ON public.payments;
CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
