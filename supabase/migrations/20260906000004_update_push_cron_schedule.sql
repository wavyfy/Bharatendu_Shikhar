-- Safely unschedule existing process-push-notifications job if present (idempotent)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'process-push-notifications') THEN
    PERFORM cron.unschedule('process-push-notifications');
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END;
$$;

-- Reschedule process-push-notifications job with 5-minute interval (*/5 * * * *)
SELECT cron.schedule(
  'process-push-notifications',
  '*/5 * * * *',
  $cron_cmd$
  SELECT net.http_get(
    url := COALESCE(
      NULLIF(current_setting('app.settings.supabase_url', true), ''),
      (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url' LIMIT 1),
      'https://jczsfwtxnyefjwbjnwsn.supabase.co'
    ) || '/functions/v1/send-push?action=cron',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || COALESCE(
        (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'anon_key' LIMIT 1),
        (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1),
        NULLIF(current_setting('app.settings.anon_key', true), ''),
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpjenNmd3R4bnllZmp3Ympud3NuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MTgxNDYsImV4cCI6MjA5NDQ5NDE0Nn0.tbqSOZCI5x86JNMgSZK9Ml13hsUAeUngxwzlXZcidqg'
      )
    )
  );
  $cron_cmd$
);
