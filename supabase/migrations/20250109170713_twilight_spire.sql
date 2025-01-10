/*
  # Fix Strategies RLS Policies

  1. Changes
    - Drop existing RLS policy for strategies table
    - Create new RLS policy allowing authenticated users to manage their strategies
    
  2. Security
    - Enable RLS on strategies table
    - Add policy for authenticated users to manage their own strategies
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can manage their own strategies" ON strategies;

-- Create new policy
CREATE POLICY "Users can manage their own strategies"
ON strategies
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;