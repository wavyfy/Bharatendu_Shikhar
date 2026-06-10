-- Grant permissions on article_live_updates to service_role and authenticated
GRANT ALL ON TABLE article_live_updates TO service_role;
GRANT ALL ON TABLE article_live_updates TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE article_live_updates_id_seq TO service_role;
GRANT USAGE, SELECT ON SEQUENCE article_live_updates_id_seq TO authenticated;
