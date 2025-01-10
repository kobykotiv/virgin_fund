/*
  # Update search history to use Unix timestamps

  1. Changes
    - Revert timestamp changes to use bigint for Unix timestamps
    - Add performance indexes
    - Update trigger functions for Unix timestamp handling

  2. Security
    - Maintain existing RLS policies
    - Add validation checks
*/

-- Update search_history table to use bigint for timestamps
ALTER TABLE search_history
  ALTER COLUMN last_searched TYPE bigint USING extract(epoch from last_searched) * 1000,
  ALTER COLUMN last_searched SET DEFAULT (extract(epoch from now()) * 1000)::bigint;

-- Update the timestamp update function for Unix timestamps
CREATE OR REPLACE FUNCTION update_search_history_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_searched = (extract(epoch from now()) * 1000)::bigint;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add index for timestamp range queries
CREATE INDEX IF NOT EXISTS idx_search_history_last_searched_unix
  ON search_history(last_searched DESC);

-- Add validation check for Unix timestamp
ALTER TABLE search_history
  ADD CONSTRAINT search_history_timestamp_check 
  CHECK (last_searched > 0);

-- Update the search history limit function for Unix timestamps
CREATE OR REPLACE FUNCTION maintain_search_history_limit()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM search_history
  WHERE id IN (
    SELECT id FROM (
      SELECT id,
             ROW_NUMBER() OVER (
               PARTITION BY user_id 
               ORDER BY last_searched DESC
             ) as rn
      FROM search_history
      WHERE user_id = NEW.user_id
    ) ranked
    WHERE rn > 50
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;