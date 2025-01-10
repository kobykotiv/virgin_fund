/*
  # Update Search History Function and Structure
  
  1. Changes
    - Update get_latest_search function to return more fields
    - Fix timestamp handling to use timestamptz
    - Add additional return fields for better search tracking
    - Add safety checks for constraints
  
  2. Security
    - Maintain RLS policies
    - Add proper function permissions
*/

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS get_latest_search;

-- Create updated function with additional fields
CREATE OR REPLACE FUNCTION get_latest_search(p_user_id uuid, p_symbol text)
RETURNS TABLE (
  symbol text,
  results jsonb,
  last_searched timestamptz,
  search_count integer
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sh.symbol,
    sh.results,
    sh.last_searched,
    sh.search_count
  FROM search_history sh
  WHERE sh.user_id = p_user_id
    AND sh.symbol = p_symbol
  ORDER BY sh.last_searched DESC
  LIMIT 1;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_latest_search TO authenticated;

-- Update the timestamp handling function
CREATE OR REPLACE FUNCTION update_search_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  -- For both inserts and updates, set the timestamp
  NEW.last_searched = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS update_search_history_last_searched ON search_history;
CREATE TRIGGER update_search_history_last_searched
  BEFORE INSERT OR UPDATE ON search_history
  FOR EACH ROW
  EXECUTE FUNCTION update_search_history_timestamp();

-- Add index for performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_search_history_lookup 
ON search_history(user_id, symbol, last_searched DESC);

-- Safely add constraints if they don't exist
DO $$ BEGIN
  -- Make results column NOT NULL if not already
  BEGIN
    ALTER TABLE search_history ALTER COLUMN results SET NOT NULL;
  EXCEPTION
    WHEN others THEN NULL;
  END;
  
  -- Add search_count_positive constraint if it doesn't exist
  BEGIN
    ALTER TABLE search_history
      ADD CONSTRAINT search_count_positive CHECK (search_count > 0);
  EXCEPTION
    WHEN duplicate_object THEN NULL;
  END;
END $$;