-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Safely unschedule existing job if present (idempotent - prevents duplicate schedules)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'monthly-content-cleanup') THEN
    PERFORM cron.unschedule('monthly-content-cleanup');
  END IF;
EXCEPTION WHEN OTHERS THEN
  NULL;
END;
$$;

-- Schedule monthly content cleanup job (1st of every month at 3:00 AM UTC)
SELECT cron.schedule(
  'monthly-content-cleanup',
  '0 3 1 * *',
  $cron_cmd$
  SELECT net.http_post(
    url := COALESCE(
      NULLIF(current_setting('app.settings.supabase_url', true), ''),
      (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'supabase_url' LIMIT 1),
      'https://jczsfwtxnyefjwbjnwsn.supabase.co'
    ) || '/functions/v1/cleanup-content',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(
        (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'service_role_key' LIMIT 1),
        NULLIF(current_setting('app.settings.service_role_key', true), ''),
        ''
      )
    ),
    body := '{}'::jsonb
  );
  $cron_cmd$
);

