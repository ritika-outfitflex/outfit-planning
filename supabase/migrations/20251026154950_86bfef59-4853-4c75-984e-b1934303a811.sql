-- Add pattern field to clothing_items table
ALTER TABLE public.clothing_items 
ADD COLUMN IF NOT EXISTS pattern TEXT,
ADD COLUMN IF NOT EXISTS style_tags TEXT[];

-- Add a comment explaining the pattern field
COMMENT ON COLUMN public.clothing_items.pattern IS 'Detected pattern/print on the clothing item (e.g., solid, striped, floral, geometric, abstract)';
COMMENT ON COLUMN public.clothing_items.style_tags IS 'Additional style tags for better outfit matching (e.g., casual, formal, bohemian)';