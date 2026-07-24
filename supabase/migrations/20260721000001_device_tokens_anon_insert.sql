-- Grant INSERT permissions on device_tokens to anon role
GRANT INSERT ON TABLE device_tokens TO anon;

-- Ensure RLS is enabled
ALTER TABLE device_tokens ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert tokens
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'device_tokens' AND policyname = 'Enable insert for anon'
    ) THEN
        CREATE POLICY "Enable insert for anon" ON device_tokens FOR INSERT WITH CHECK (true);
    END IF;
END
$$;
