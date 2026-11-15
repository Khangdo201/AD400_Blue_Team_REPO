CREATE TABLE public.offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  company_name text NOT NULL CHECK (btrim(company_name) <> ''),
  job_title text NOT NULL CHECK (btrim(job_title) <> ''),
  salary numeric(12, 2) NOT NULL CHECK (salary > 0),
  signing_bonus numeric(12, 2) CHECK (signing_bonus IS NULL OR signing_bonus >= 0),
  first_year_equity numeric(12, 2) CHECK (
    first_year_equity IS NULL OR first_year_equity >= 0
  ),
  pto_days integer CHECK (pto_days IS NULL OR pto_days >= 0),
  sick_leave_days integer CHECK (sick_leave_days IS NULL OR sick_leave_days >= 0),
  employer_match numeric(5, 2) CHECK (
    employer_match IS NULL OR employer_match BETWEEN 0 AND 100
  ),
  work_arrangement text CHECK (
    work_arrangement IS NULL OR work_arrangement IN ('Remote', 'Hybrid', 'On-site')
  ),
  learning_opportunities text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX offers_user_created_at_idx
  ON public.offers (user_id, created_at DESC);

CREATE FUNCTION public.set_offers_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.set_offers_updated_at() FROM PUBLIC;

CREATE TRIGGER offers_set_updated_at
  BEFORE UPDATE ON public.offers
  FOR EACH ROW
  EXECUTE FUNCTION public.set_offers_updated_at();
