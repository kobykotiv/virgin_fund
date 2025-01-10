/*
  # Fix strategies table RLS policies

  1. Changes
    - Drop existing RLS policies for strategies table
    - Create new, more permissive RLS policy for authenticated users
    - Ensure proper user_id check for new rows
  
  2. Security
    - Maintains row-level security
    - Only allows users to access their own strategies
    - Explicitly allows INSERT operations for authenticated users
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own strategies" ON strategies;

-- Create new comprehensive policy
CREATE POLICY "Users can manage their own strategies"
ON strategies
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;