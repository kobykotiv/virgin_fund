/*
  # Create Append-Only Notes Table

  1. New Tables
    - `append_notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `content` (text, required)
      - `tags` (text array, optional)
      - `category` (text, optional)
      - `created_at` (timestamptz, auto-set)

  2. Security
    - Enable RLS on `append_notes` table
    - Users can only INSERT new notes (append)
    - Users can only SELECT their own notes
    - No UPDATE or DELETE policies to enforce append-only behavior
    - Add index on user_id and created_at for query performance

  3. Append-Only Enforcement
    - RLS prevents any modifications or deletions
    - Only SELECT and INSERT operations allowed
    - immutable audit trail of all user entries
*/

CREATE TABLE IF NOT EXISTS append_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL CHECK (char_length(title) > 0 AND char_length(title) <= 200),
  content text NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 5000),
  tags text[] DEFAULT '{}',
  category text CHECK (char_length(category) <= 100),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_append_notes_user_id ON append_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_append_notes_created_at ON append_notes(user_id, created_at DESC);

ALTER TABLE append_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notes"
  ON append_notes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes"
  ON append_notes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);
