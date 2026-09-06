-- Drop translation triggers
DROP TRIGGER IF EXISTS trigger_invalidate_article_translations ON articles;
DROP TRIGGER IF EXISTS trigger_invalidate_epaper_translations ON epapers;
DROP TRIGGER IF EXISTS trigger_invalidate_election_translations ON elections;
DROP TRIGGER IF EXISTS trigger_invalidate_sports_translations ON sports_matches;
DROP TRIGGER IF EXISTS trigger_invalidate_live_update_translations ON article_live_updates;

-- Drop translation functions
DROP FUNCTION IF EXISTS invalidate_article_translations;
DROP FUNCTION IF EXISTS invalidate_epaper_translations;
DROP FUNCTION IF EXISTS invalidate_election_translations;
DROP FUNCTION IF EXISTS invalidate_sports_translations;
DROP FUNCTION IF EXISTS invalidate_live_update_translations;

-- Drop translation tables
DROP TABLE IF EXISTS article_translations;
DROP TABLE IF EXISTS epaper_translations;
DROP TABLE IF EXISTS election_translations;
DROP TABLE IF EXISTS sports_translations;
DROP TABLE IF EXISTS live_update_translations;
