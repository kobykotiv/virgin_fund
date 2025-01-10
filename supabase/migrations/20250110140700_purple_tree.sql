/*
  # Search History Improvements

  1. Changes
    - Add created_at column
    - Add indexes for performance
    - Update constraints and triggers
    - Improve RLS policies

  2. Performance
    - Added indexes for common queries
    - Optimized search history limit function
*/

-- Update search_history table structure
ALTER TABLE search_history
  ADD COLUMN IF NOT EXISTS created_at bigint DEFAULT EXTRACT(EPOCH FROM now())::bigint;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_search_history_user_symbol 
  ON search_history(user_id, symbol);

CREATE INDEX IF NOT EXISTS idx_search_history_last_searched 
  ON search_history(last_searched DESC);

-- Update or create the function to maintain search history limit
CREATE OR REPLACE FUNCTION maintain_search_history_limit()
RETURNS TRIGGER AS $$
BEGIN
  -- Delete old entries keeping only the latest 50 per user
  DELETE FROM search_history
  WHERE id IN (
    SELECT id FROM (
      SELECT id,
             ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY last_searched DESC) as rn
      FROM search_history
      WHERE user_id = NEW.user_id
    ) ranked
    WHERE rn > 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS limit_search_history ON search_history;
CREATE TRIGGER limit_search_history
  AFTER INSERT ON search_history
  FOR EACH ROW
  EXECUTE FUNCTION maintain_search_history_limit();

-- Add validation check for search count
ALTER TABLE search_history
  ADD CONSTRAINT search_count_positive CHECK (search_count > 0);

-- Update RLS policies
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage their own search history" ON search_history;
CREATE POLICY "Users can manage their own search history"
  ON search_history
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Add function to automatically update last_searched
CREATE OR REPLACE FUNCTION update_search_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_searched = EXTRACT(EPOCH FROM now())::bigint;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_search_history_last_searched
  BEFORE UPDATE ON search_history
  FOR EACH ROW
  EXECUTE FUNCTION update_search_history_timestamp();