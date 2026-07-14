-- ============================================================
-- Sports Module Migration
-- Tables: sports_teams, sports_competitions, sports_matches,
--         sports_points_table_entries, sports_match_updates
-- ============================================================

-- Enable moddatetime if not already enabled
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- ------------------------------------------------------------
-- sports_teams (reference data, admin-only write)
-- ------------------------------------------------------------
CREATE TABLE sports_teams (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    short_name text,
    sport text CHECK (sport IN ('cricket', 'football')),
    country text,
    logo_url text,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sports_teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sports_teams: public read" ON sports_teams
    FOR SELECT USING (true);

CREATE POLICY "sports_teams: admin write" ON sports_teams
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE TRIGGER set_sports_teams_updated_at
    BEFORE UPDATE ON sports_teams
    FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

-- ------------------------------------------------------------
-- sports_competitions
-- ------------------------------------------------------------
CREATE TABLE sports_competitions (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    sport text NOT NULL CHECK (sport IN ('cricket', 'football')),
    competition_type text NOT NULL CHECK (competition_type IN ('tournament', 'series', 'league', 'cup')),
    season text,
    start_date timestamptz,
    end_date timestamptz,
    status text NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')) DEFAULT 'upcoming',
    is_published boolean NOT NULL DEFAULT false,
    display_order integer NOT NULL DEFAULT 0,
    banner_url text,
    logo_url text,
    description text,
    region_id bigint REFERENCES regions(id) ON DELETE SET NULL,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sports_competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sports_competitions: public read if published" ON sports_competitions
    FOR SELECT USING (is_published = true);

CREATE POLICY "sports_competitions: admin full access" ON sports_competitions
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "sports_competitions: publisher view all" ON sports_competitions
    FOR SELECT USING (auth.jwt() ->> 'role' = 'publisher');

CREATE POLICY "sports_competitions: publisher insert own" ON sports_competitions
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by
    );

CREATE POLICY "sports_competitions: publisher update own" ON sports_competitions
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by)
    WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "sports_competitions: publisher delete own" ON sports_competitions
    FOR DELETE USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE TRIGGER set_sports_competitions_updated_at
    BEFORE UPDATE ON sports_competitions
    FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

-- ------------------------------------------------------------
-- sports_matches
-- ------------------------------------------------------------
CREATE TABLE sports_matches (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    sport text NOT NULL CHECK (sport IN ('cricket', 'football')),
    match_type text CHECK (match_type IN ('test', 'odi', 't20', 'league', 'cup', 'friendly')),
    competition_id uuid REFERENCES sports_competitions(id) ON DELETE SET NULL,
    home_team_id uuid REFERENCES sports_teams(id) ON DELETE SET NULL,
    away_team_id uuid REFERENCES sports_teams(id) ON DELETE SET NULL,
    home_team_name text,
    away_team_name text,
    venue text,
    country text,
    is_international boolean NOT NULL DEFAULT false,
    match_date timestamptz,
    status text NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')) DEFAULT 'upcoming',
    stage text,
    is_featured boolean NOT NULL DEFAULT false,
    match_number text,
    home_score text,
    away_score text,
    result_text text,
    live_status_text text,
    winning_team text,
    toss_info text,
    match_note text,
    is_published boolean NOT NULL DEFAULT false,
    display_order integer NOT NULL DEFAULT 0,
    region_id bigint REFERENCES regions(id) ON DELETE SET NULL,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sports_matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sports_matches: public read if published" ON sports_matches
    FOR SELECT USING (is_published = true);

CREATE POLICY "sports_matches: admin full access" ON sports_matches
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "sports_matches: publisher view all" ON sports_matches
    FOR SELECT USING (auth.jwt() ->> 'role' = 'publisher');

CREATE POLICY "sports_matches: publisher insert own" ON sports_matches
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by
    );

CREATE POLICY "sports_matches: publisher update own" ON sports_matches
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by)
    WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "sports_matches: publisher delete own" ON sports_matches
    FOR DELETE USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE TRIGGER set_sports_matches_updated_at
    BEFORE UPDATE ON sports_matches
    FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

-- ------------------------------------------------------------
-- sports_points_table_entries (owned by competition)
-- ------------------------------------------------------------
CREATE TABLE sports_points_table_entries (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    competition_id uuid NOT NULL REFERENCES sports_competitions(id) ON DELETE CASCADE,
    group_name text,
    team_id uuid REFERENCES sports_teams(id) ON DELETE SET NULL,
    team_name text NOT NULL,
    team_logo_url text,
    played integer NOT NULL DEFAULT 0,
    won integer NOT NULL DEFAULT 0,
    drawn integer NOT NULL DEFAULT 0,
    lost integer NOT NULL DEFAULT 0,
    goals_for integer NOT NULL DEFAULT 0,
    goals_against integer NOT NULL DEFAULT 0,
    runs_for integer NOT NULL DEFAULT 0,
    runs_against integer NOT NULL DEFAULT 0,
    net_run_rate numeric(6,3),
    points integer NOT NULL DEFAULT 0,
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sports_points_table_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sports_points_table: public read if competition published" ON sports_points_table_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sports_competitions sc
            WHERE sc.id = sports_points_table_entries.competition_id
              AND sc.is_published = true
        )
    );

CREATE POLICY "sports_points_table: admin full access" ON sports_points_table_entries
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "sports_points_table: publisher view all" ON sports_points_table_entries
    FOR SELECT USING (auth.jwt() ->> 'role' = 'publisher');

CREATE POLICY "sports_points_table: publisher write for own competition" ON sports_points_table_entries
    FOR ALL
    USING (
        auth.jwt() ->> 'role' = 'publisher' AND
        EXISTS (
            SELECT 1 FROM sports_competitions sc
            WHERE sc.id = competition_id AND sc.created_by = auth.uid()
        )
    )
    WITH CHECK (
        auth.jwt() ->> 'role' = 'publisher' AND
        EXISTS (
            SELECT 1 FROM sports_competitions sc
            WHERE sc.id = competition_id AND sc.created_by = auth.uid()
        )
    );

CREATE TRIGGER set_sports_points_table_updated_at
    BEFORE UPDATE ON sports_points_table_entries
    FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');

-- ------------------------------------------------------------
-- sports_match_updates (append-only commentary)
-- ------------------------------------------------------------
CREATE TABLE sports_match_updates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    match_id uuid NOT NULL REFERENCES sports_matches(id) ON DELETE CASCADE,
    update_type text NOT NULL DEFAULT 'commentary'
        CHECK (update_type IN ('commentary', 'wicket', 'goal', 'milestone', 'status')),
    title text,
    content text NOT NULL,
    over_ball text,
    minute integer,
    is_key_moment boolean NOT NULL DEFAULT false,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sports_match_updates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sports_match_updates: public read if match published" ON sports_match_updates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM sports_matches sm
            WHERE sm.id = sports_match_updates.match_id
              AND sm.is_published = true
        )
    );

CREATE POLICY "sports_match_updates: admin full access" ON sports_match_updates
    FOR ALL
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "sports_match_updates: publisher view all" ON sports_match_updates
    FOR SELECT USING (auth.jwt() ->> 'role' = 'publisher');

CREATE POLICY "sports_match_updates: publisher insert own" ON sports_match_updates
    FOR INSERT WITH CHECK (
        auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by
    );

CREATE POLICY "sports_match_updates: publisher delete own" ON sports_match_updates
    FOR DELETE USING (
        auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by
    );

-- ------------------------------------------------------------
-- Indexes
-- ------------------------------------------------------------
CREATE INDEX idx_sports_competitions_slug ON sports_competitions(slug);
CREATE INDEX idx_sports_competitions_sport_status_start ON sports_competitions(sport, status, start_date);

CREATE INDEX idx_sports_matches_slug ON sports_matches(slug);
CREATE INDEX idx_sports_matches_sport_status_date ON sports_matches(sport, status, match_date);
CREATE INDEX idx_sports_matches_competition_date ON sports_matches(competition_id, match_date);
CREATE INDEX idx_sports_matches_is_featured ON sports_matches(is_featured) WHERE is_featured = true;
CREATE INDEX idx_sports_matches_status ON sports_matches(status);

CREATE INDEX idx_sports_points_competition_id ON sports_points_table_entries(competition_id);

CREATE INDEX idx_sports_updates_match_id ON sports_match_updates(match_id);
CREATE INDEX idx_sports_updates_created_at ON sports_match_updates(match_id, created_at DESC);

CREATE UNIQUE INDEX idx_sports_points_table_unique ON sports_points_table_entries(competition_id, COALESCE(group_name, ''), team_id);
