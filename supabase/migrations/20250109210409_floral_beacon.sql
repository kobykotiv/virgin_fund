/*
  # Add Profile Creation Trigger

  1. Changes
    - Add trigger to automatically create a profile when a new user signs up
    - Add function to handle the profile creation
    - Set default values for new profiles

  2. Security
    - Maintain existing RLS policies
    - Only system can create initial profile
*/

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id,
    full_name,
    investment_experience,
    risk_tolerance,
    preferred_currency,
    notification_preferences
  ) VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'beginner',
    'moderate',
    'USD',
    '{"email": true, "push": false}'::jsonb
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();