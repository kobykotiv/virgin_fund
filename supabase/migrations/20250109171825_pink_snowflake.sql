-- Create search history table
CREATE TABLE IF NOT EXISTS search_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol text NOT NULL,
  search_count integer DEFAULT 1,
  last_searched timestamptz DEFAULT now(),
  UNIQUE(user_id, symbol)
);

-- Create user preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  theme text DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create function to maintain search history limit
CREATE OR REPLACE FUNCTION maintain_search_history_limit()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM search_history
  WHERE id IN (
    SELECT id FROM search_history
    WHERE user_id = NEW.user_id
    ORDER BY last_searched DESC, search_count DESC
    OFFSET 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search history limit
DROP TRIGGER IF EXISTS limit_search_history ON search_history;
CREATE TRIGGER limit_search_history
  AFTER INSERT ON search_history
  FOR EACH ROW
  EXECUTE FUNCTION maintain_search_history_limit();

-- Enable RLS
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
DROP POLICY IF EXISTS "Users can manage their own search history" ON search_history;
CREATE POLICY "Users can manage their own search history"
  ON search_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage their own preferences" ON user_preferences;
CREATE POLICY "Users can manage their own preferences"
  ON user_preferences
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);