
-- Fix the hex_color column and add seasons/occasions arrays
-- Also add a new table for daily outfit tracking

-- First, set a default value for hex_color column
ALTER TABLE public.clothing_items 
ALTER COLUMN hex_color SET DEFAULT '#000000';

-- Update any existing NULL hex_color values
UPDATE public.clothing_items 
SET hex_color = '#000000' 
WHERE hex_color IS NULL;

-- Now make it NOT NULL
ALTER TABLE public.clothing_items 
ALTER COLUMN hex_color SET NOT NULL;

-- Update season and occasion to support arrays
ALTER TABLE public.clothing_items 
DROP COLUMN IF EXISTS season,
ADD COLUMN seasons text[] DEFAULT '{}',
DROP COLUMN IF EXISTS occasion,
ADD COLUMN occasions text[] DEFAULT '{}';

-- Create outfit_calendar table for tracking daily outfits
CREATE TABLE IF NOT EXISTS public.outfit_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  outfit_id UUID REFERENCES public.outfits(id) ON DELETE CASCADE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, date)
);

-- Add RLS policies for outfit_calendar
ALTER TABLE public.outfit_calendar ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own outfit calendar" 
  ON public.outfit_calendar 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outfit calendar entries" 
  ON public.outfit_calendar 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfit calendar entries" 
  ON public.outfit_calendar 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfit calendar entries" 
  ON public.outfit_calendar 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Add updated_at trigger for outfit_calendar
CREATE TRIGGER outfit_calendar_updated_at
  BEFORE UPDATE ON public.outfit_calendar
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();
