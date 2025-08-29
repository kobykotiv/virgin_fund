-- Create bots table
CREATE TABLE IF NOT EXISTS public.bots (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    strategy TEXT NOT NULL DEFAULT 'dca',
    assets JSONB DEFAULT '[]'::jsonb,
    allocation DECIMAL(20,8),
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'paused' CHECK (status IN ('running', 'paused', 'stopped')),
    schedule_cron TEXT,
    initial_balance DECIMAL(20,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bots_owner_id ON public.bots(owner_id);
CREATE INDEX IF NOT EXISTS idx_bots_status ON public.bots(status);
CREATE INDEX IF NOT EXISTS idx_bots_created_at ON public.bots(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.bots ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own bots" ON public.bots
    FOR SELECT USING (auth.uid() = owner_id);

CREATE POLICY "Users can insert their own bots" ON public.bots
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Users can update their own bots" ON public.bots
    FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "Users can delete their own bots" ON public.bots
    FOR DELETE USING (auth.uid() = owner_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_bots_updated_at
    BEFORE UPDATE ON public.bots
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();