CREATE OR REPLACE FUNCTION public.get_internal_table_counts()
RETURNS TABLE (
  table_name text,
  row_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
    SELECT 'cron.job_run_details'::text, count(*) FROM cron.job_run_details;
  
  IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'net' AND tablename = '_http_response') THEN
    RETURN QUERY
      EXECUTE 'SELECT ''net._http_response''::text, count(*) FROM net._http_response';
  END IF;
END;
$$;
