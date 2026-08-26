ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS image_url_4 text,
  ADD COLUMN IF NOT EXISTS image_url_5 text;