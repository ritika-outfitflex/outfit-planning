-- Add demographic fields to profiles table
ALTER TABLE profiles
ADD COLUMN age_group text,
ADD COLUMN gender text,
ADD COLUMN region text;

-- Add check constraints for valid values
ALTER TABLE profiles
ADD CONSTRAINT valid_age_group CHECK (age_group IN ('child', 'teen', 'young_adult', 'adult', 'senior') OR age_group IS NULL);

ALTER TABLE profiles
ADD CONSTRAINT valid_gender CHECK (gender IN ('male', 'female', 'non_binary', 'prefer_not_to_say') OR gender IS NULL);

COMMENT ON COLUMN profiles.age_group IS 'User age group for personalized fashion recommendations';
COMMENT ON COLUMN profiles.gender IS 'User gender for personalized fashion recommendations';
COMMENT ON COLUMN profiles.region IS 'User region for cultural clothing preferences (e.g., India, USA, UK)';