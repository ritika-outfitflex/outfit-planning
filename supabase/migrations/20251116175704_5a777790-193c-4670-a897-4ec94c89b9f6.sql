-- Add style_preferences column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS style_preferences jsonb DEFAULT '{}'::jsonb;

-- Add comment to explain the structure
COMMENT ON COLUMN profiles.style_preferences IS 'Stores user style preferences including favorite_colors, favorite_styles, occasions, body_type, and style_goals';
