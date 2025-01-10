/*
  # Fix strategy table RLS policies

  1. Changes
    - Drop all existing strategy policies
    - Create new comprehensive policy for all operations
    - Re-enable RLS
  
  2. Security
    - Ensures authenticated users can only manage their own strategies
    - Covers all CRUD operations in a single policy
*/

-- First drop all existing policies for strategies
DROP POLICY IF EXISTS "Users can manage their own strategies" ON strategies;
DROP POLICY IF EXISTS "Users can insert their own strategies" ON strategies;
DROP POLICY IF EXISTS "Users can view their own strategies" ON strategies;
DROP POLICY IF EXISTS "Users can update their own strategies" ON strategies;
DROP POLICY IF EXISTS "Users can delete their own strategies" ON strategies;

-- Create a single comprehensive policy
CREATE POLICY "Users can manage their own strategies"
ON strategies
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Ensure RLS is enabled
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;