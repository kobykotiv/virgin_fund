-- Create a function to safely get the latest search result
CREATE OR REPLACE FUNCTION get_latest_search(p_user_id uuid, p_symbol text)
RETURNS TABLE (
  results jsonb,
  last_searched bigint
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT sh.results, sh.last_searched
  FROM search_history sh
  WHERE sh.user_id = p_user_id
    AND sh.symbol = p_symbol
  ORDER BY sh.last_searched DESC
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_latest_search TO authenticated;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_search_history_lookup 
ON search_history(user_id, symbol, last_searched DESC);

-- Add constraint to ensure results is not null
ALTER TABLE search_history
  ALTER COLUMN results SET NOT NULL,
  ADD CONSTRAINT results_not_null CHECK (results IS NOT NULL);

-- Update the search history trigger to handle updates
CREATE OR REPLACE FUNCTION update_search_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- For both inserts and updates, set the timestamp
  NEW.last_searched = EXTRACT(EPOCH FROM now())::bigint;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure trigger works for both INSERT and UPDATE
DROP TRIGGER IF EXISTS update_search_history_last_searched ON search_history;
CREATE TRIGGER update_search_history_last_searched
  BEFORE INSERT OR UPDATE ON search_history
  FOR EACH ROW
  EXECUTE FUNCTION update_search_history_timestamp();