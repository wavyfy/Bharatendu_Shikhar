-- Grant permissions on device_tokens to service_role
-- Required for the admin push notification service to read and clean up tokens
GRANT ALL ON TABLE device_tokens TO service_role;
GRANT ALL ON TABLE device_tokens TO authenticated;
