-- ============================================================
-- Optional: schedule the BEOE scraper via pg_cron + pg_net
-- ============================================================
-- PREREQUISITE: Enable both extensions in the Supabase dashboard first:
--   Database → Extensions → pg_cron   (enable)
--   Database → Extensions → pg_net    (enable)
--
-- ALTERNATIVE: Use the Supabase dashboard instead of this SQL:
--   Edge Functions → scrape-beoe → Schedule → every 6 hours
--   This is simpler and does not require storing credentials in SQL.
--
-- If you prefer the SQL-based approach, fill in your service role key
-- below and run this script in the SQL Editor.
-- ============================================================

-- Create a pg_cron job that hits the Edge Function every 6 hours.
-- Replace <YOUR_SERVICE_ROLE_KEY> with the key from
-- Supabase dashboard → Settings → API → service_role key.

/*

SELECT cron.schedule(
  'beoe-scraper-every-6h',                        -- job name (must be unique)
  '0 */6 * * *',                                  -- cron expression
  $$
    SELECT net.http_post(
      url     := 'https://cfjlnyqvamggmnhmqrsw.supabase.co/functions/v1/scrape-beoe',
      headers := jsonb_build_object(
                   'Content-Type',  'application/json',
                   'Authorization', 'Bearer <YOUR_SERVICE_ROLE_KEY>'
                 ),
      body    := '{}'::jsonb
    );
  $$
);

*/

-- To view scheduled jobs:
-- SELECT * FROM cron.job;

-- To unschedule:
-- SELECT cron.unschedule('beoe-scraper-every-6h');

-- To view recent run history:
-- SELECT * FROM cron.job_run_details ORDER BY start_time DESC LIMIT 20;
