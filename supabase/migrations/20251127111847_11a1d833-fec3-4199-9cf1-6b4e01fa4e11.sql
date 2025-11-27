-- Update the handle_new_user function to include demographic fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, age_group, gender, region)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'age_group',
    NEW.raw_user_meta_data->>'gender',
    NEW.raw_user_meta_data->>'region'
  );
  RETURN NEW;
END;
$$;