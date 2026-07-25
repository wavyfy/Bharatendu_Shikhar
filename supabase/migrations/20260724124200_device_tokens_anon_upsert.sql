-- Grant UPDATE, SELECT permissions on device_tokens to anon role
GRANT UPDATE, SELECT ON TABLE device_tokens TO anon;

-- Create policy to allow anyone to update tokens
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'device_tokens' AND policyname = 'Enable update for anon'
    ) THEN
        CREATE POLICY "Enable update for anon" ON device_tokens FOR UPDATE USING (true);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'device_tokens' AND policyname = 'Enable select for anon'
    ) THEN
        CREATE POLICY "Enable select for anon" ON device_tokens FOR SELECT USING (true);
    END IF;
END
$$;
