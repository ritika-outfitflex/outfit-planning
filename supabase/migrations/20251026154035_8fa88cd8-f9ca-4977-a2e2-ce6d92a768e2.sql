-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create clothing_items table
CREATE TABLE IF NOT EXISTS public.clothing_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  color TEXT NOT NULL,
  hex_color TEXT NOT NULL,
  size TEXT,
  material TEXT,
  seasons TEXT[],
  occasions TEXT[],
  image_url TEXT,
  notes TEXT,
  purchase_date DATE,
  times_worn INTEGER NOT NULL DEFAULT 0,
  last_worn DATE,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on clothing_items
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;

-- Clothing items policies
CREATE POLICY "Users can view their own clothing items"
  ON public.clothing_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own clothing items"
  ON public.clothing_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clothing items"
  ON public.clothing_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clothing items"
  ON public.clothing_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create outfits table
CREATE TABLE IF NOT EXISTS public.outfits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  season TEXT,
  occasion TEXT,
  weather TEXT,
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  times_worn INTEGER NOT NULL DEFAULT 0,
  last_worn DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on outfits
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;

-- Outfits policies
CREATE POLICY "Users can view their own outfits"
  ON public.outfits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own outfits"
  ON public.outfits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own outfits"
  ON public.outfits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own outfits"
  ON public.outfits FOR DELETE
  USING (auth.uid() = user_id);

-- Create outfit_items junction table
CREATE TABLE IF NOT EXISTS public.outfit_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID NOT NULL REFERENCES public.outfits ON DELETE CASCADE,
  clothing_item_id UUID NOT NULL REFERENCES public.clothing_items ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on outfit_items
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;

-- Outfit items policies (users can manage items for their own outfits)
CREATE POLICY "Users can view outfit items for their outfits"
  ON public.outfit_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.outfits
      WHERE outfits.id = outfit_items.outfit_id
      AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create outfit items for their outfits"
  ON public.outfit_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.outfits
      WHERE outfits.id = outfit_items.outfit_id
      AND outfits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete outfit items from their outfits"
  ON public.outfit_items FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.outfits
      WHERE outfits.id = outfit_items.outfit_id
      AND outfits.user_id = auth.uid()
    )
  );

-- Create outfit_calendar table
CREATE TABLE IF NOT EXISTS public.outfit_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  date DATE NOT NULL,
  outfit_id UUID REFERENCES public.outfits ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS on outfit_calendar
ALTER TABLE public.outfit_calendar ENABLE ROW LEVEL SECURITY;

-- Outfit calendar policies
CREATE POLICY "Users can view their own calendar entries"
  ON public.outfit_calendar FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calendar entries"
  ON public.outfit_calendar FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar entries"
  ON public.outfit_calendar FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own calendar entries"
  ON public.outfit_calendar FOR DELETE
  USING (auth.uid() = user_id);

-- Create fashion_chats table for AI assistant
CREATE TABLE IF NOT EXISTS public.fashion_chats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS on fashion_chats
ALTER TABLE public.fashion_chats ENABLE ROW LEVEL SECURITY;

-- Fashion chats policies
CREATE POLICY "Users can view their own chat history"
  ON public.fashion_chats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages"
  ON public.fashion_chats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_clothing_items_updated_at
  BEFORE UPDATE ON public.clothing_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_outfits_updated_at
  BEFORE UPDATE ON public.outfits
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_outfit_calendar_updated_at
  BEFORE UPDATE ON public.outfit_calendar
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();