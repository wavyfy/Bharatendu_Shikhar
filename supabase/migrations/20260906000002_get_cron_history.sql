CREATE OR REPLACE FUNCTION public.get_cron_history()
RETURNS TABLE (
  jobid bigint,
  runid bigint,
  job_pid integer,
  database text,
  username text,
  command text,
  status text,
  return_message text,
  start_time timestamptz,
  end_time timestamptz
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT jobid, runid, job_pid, database, username, command, status, return_message, start_time, end_time
  FROM cron.job_run_details
  ORDER BY start_time DESC
  LIMIT 20;
$$;
