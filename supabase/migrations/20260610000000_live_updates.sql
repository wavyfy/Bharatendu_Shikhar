-- ============================================================
-- Live Update Timeline
-- ============================================================

-- 1. Add is_live flag to articles
ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS is_live BOOLEAN NOT NULL DEFAULT false;

-- 2. Create live updates table
CREATE TABLE IF NOT EXISTS article_live_updates (
  id          BIGSERIAL PRIMARY KEY,
  article_id  BIGINT      NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  headline    TEXT        NOT NULL,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_by  UUID        NOT NULL REFERENCES auth.users(id)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_live_updates_article_id
  ON article_live_updates(article_id);

CREATE INDEX IF NOT EXISTS idx_live_updates_created_at
  ON article_live_updates(article_id, created_at DESC);

-- 4. Row Level Security
ALTER TABLE article_live_updates ENABLE ROW LEVEL SECURITY;

-- Admin: full access to all live updates
DO $$ BEGIN
  CREATE POLICY "admin_all_live_updates"
    ON article_live_updates
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Publisher: only their own articles' updates
DO $$ BEGIN
  CREATE POLICY "publisher_own_live_updates"
    ON article_live_updates
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM articles
        WHERE articles.id = article_live_updates.article_id
          AND articles.author_id = auth.uid()
      )
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
