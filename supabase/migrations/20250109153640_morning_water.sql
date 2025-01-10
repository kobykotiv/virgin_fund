/*
  # Initial Schema Setup for DCA Investment App

  1. Tables
    - users (managed by Supabase Auth)
    - strategies
      - Stores user investment strategies
      - Contains configuration parameters
    - asset_data
      - Caches historical price data
      - Includes TTL for cache management
    - transactions
      - Records simulated investment transactions
      - Links to strategies

  2. Security
    - RLS policies for all tables
    - Users can only access their own data
    - Trigger-based enforcement of max 3 strategies per user
*/

-- Strategies table
CREATE TABLE strategies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  initial_investment decimal NOT NULL CHECK (initial_investment >= 100 AND initial_investment <= 100000),
  frequency text NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
  duration_years integer NOT NULL CHECK (duration_years >= 1 AND duration_years <= 20),
  start_date date NOT NULL,
  assets text[] NOT NULL CHECK (array_length(assets, 1) <= 10),
  created_at timestamptz DEFAULT now()
);

-- Asset data cache
CREATE TABLE asset_data (
  symbol text NOT NULL,
  date date NOT NULL,
  price decimal NOT NULL,
  last_updated timestamptz DEFAULT now(),
  PRIMARY KEY (symbol, date)
);

-- Transactions table
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  strategy_id uuid REFERENCES strategies(id) ON DELETE CASCADE,
  date date NOT NULL,
  symbol text NOT NULL,
  shares decimal NOT NULL,
  price decimal NOT NULL,
  amount decimal NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create function to check strategy count
CREATE OR REPLACE FUNCTION check_strategy_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM strategies WHERE user_id = NEW.user_id) >= 3 THEN
    RAISE EXCEPTION 'User cannot have more than 3 strategies';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce strategy limit
CREATE TRIGGER enforce_strategy_limit
  BEFORE INSERT ON strategies
  FOR EACH ROW
  EXECUTE FUNCTION check_strategy_limit();

-- Enable RLS
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE asset_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own strategies"
  ON strategies
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Asset data is readable by all authenticated users"
  ON asset_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read transactions for their strategies"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM strategies 
      WHERE strategies.id = transactions.strategy_id 
      AND strategies.user_id = auth.uid()
    )
  );