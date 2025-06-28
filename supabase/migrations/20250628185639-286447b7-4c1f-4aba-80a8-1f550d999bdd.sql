
-- Create user profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clothing items table
CREATE TABLE public.clothing_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  color TEXT NOT NULL,
  hex_color TEXT,
  brand TEXT,
  size TEXT,
  material TEXT,
  season TEXT,
  occasion TEXT,
  image_url TEXT,
  notes TEXT,
  purchase_date DATE,
  price DECIMAL(10,2),
  times_worn INTEGER DEFAULT 0,
  last_worn DATE,
  is_favorite BOOLEAN DEFAULT FALSE,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outfits table
CREATE TABLE public.outfits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  season TEXT,
  occasion TEXT,
  weather TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  times_worn INTEGER DEFAULT 0,
  last_worn DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create outfit items junction table (many-to-many relationship)
CREATE TABLE public.outfit_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  outfit_id UUID REFERENCES public.outfits ON DELETE CASCADE NOT NULL,
  clothing_item_id UUID REFERENCES public.clothing_items ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(outfit_id, clothing_item_id)
);

-- Create AI suggestions table to store outfit recommendations
CREATE TABLE public.ai_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  suggestion_type TEXT NOT NULL, -- 'outfit', 'item_pairing', 'seasonal'
  input_data JSONB, -- stores the context/input for the suggestion
  suggestion_data JSONB NOT NULL, -- stores the AI's suggestion
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create fashion assistant chat table
CREATE TABLE public.fashion_chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  context JSONB, -- stores relevant wardrobe context
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user preferences table for personalization
CREATE TABLE public.user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  style_preferences TEXT[],
  color_preferences TEXT[],
  preferred_brands TEXT[],
  body_type TEXT,
  size_info JSONB,
  budget_range TEXT,
  lifestyle TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clothing_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outfit_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fashion_chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for clothing items
CREATE POLICY "Users can view own clothing items" ON public.clothing_items
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own clothing items" ON public.clothing_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own clothing items" ON public.clothing_items
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own clothing items" ON public.clothing_items
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for outfits
CREATE POLICY "Users can view own outfits" ON public.outfits
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own outfits" ON public.outfits
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own outfits" ON public.outfits
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own outfits" ON public.outfits
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for outfit items
CREATE POLICY "Users can view own outfit items" ON public.outfit_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.outfits 
      WHERE outfits.id = outfit_items.outfit_id 
      AND outfits.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own outfit items" ON public.outfit_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.outfits 
      WHERE outfits.id = outfit_items.outfit_id 
      AND outfits.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can delete own outfit items" ON public.outfit_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.outfits 
      WHERE outfits.id = outfit_items.outfit_id 
      AND outfits.user_id = auth.uid()
    )
  );

-- Create RLS policies for AI suggestions
CREATE POLICY "Users can view own AI suggestions" ON public.ai_suggestions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own AI suggestions" ON public.ai_suggestions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own AI suggestions" ON public.ai_suggestions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for fashion chats
CREATE POLICY "Users can view own fashion chats" ON public.fashion_chats
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own fashion chats" ON public.fashion_chats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user preferences
CREATE POLICY "Users can view own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Create storage bucket for clothing images
INSERT INTO storage.buckets (id, name, public) VALUES ('clothing-images', 'clothing-images', true);

-- Create storage policies for clothing images
CREATE POLICY "Users can upload clothing images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'clothing-images' AND auth.role() = 'authenticated');
CREATE POLICY "Users can view clothing images" ON storage.objects
  FOR SELECT USING (bucket_id = 'clothing-images');
CREATE POLICY "Users can update own clothing images" ON storage.objects
  FOR UPDATE USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own clothing images" ON storage.objects
  FOR DELETE USING (bucket_id = 'clothing-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_clothing_items_updated_at
  BEFORE UPDATE ON public.clothing_items
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_outfits_updated_at
  BEFORE UPDATE ON public.outfits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
