-- Add detailed clothing attributes
ALTER TABLE clothing_items 
ADD COLUMN IF NOT EXISTS sleeve_type TEXT,
ADD COLUMN IF NOT EXISTS pant_style TEXT,
ADD COLUMN IF NOT EXISTS neckline TEXT,
ADD COLUMN IF NOT EXISTS fit TEXT;