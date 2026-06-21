-- Migration for Elections Module

CREATE TABLE elections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    slug text NOT NULL UNIQUE,
    description text,
    featured_image_url text,
    region_id bigint REFERENCES regions(id) ON DELETE SET NULL,
    status text NOT NULL CHECK (status IN ('upcoming', 'live', 'completed')) DEFAULT 'upcoming',
    is_published boolean NOT NULL DEFAULT false,
    display_order integer NOT NULL DEFAULT 0,
    voting_date timestamptz,
    result_date timestamptz,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE election_groups (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    election_id uuid NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    title text NOT NULL,
    sort_order integer NOT NULL DEFAULT 0,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE election_candidates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    group_id uuid NOT NULL REFERENCES election_groups(id) ON DELETE CASCADE,
    candidate_name text NOT NULL,
    party_name text,
    party_symbol_url text,
    photo_url text,
    votes bigint NOT NULL DEFAULT 0,
    is_winner boolean NOT NULL DEFAULT false,
    sort_order integer NOT NULL DEFAULT 0,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE election_updates (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    election_id uuid NOT NULL REFERENCES elections(id) ON DELETE CASCADE,
    title text NOT NULL,
    content text NOT NULL,
    created_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE election_updates ENABLE ROW LEVEL SECURITY;

-- Indexes for performance
CREATE INDEX idx_elections_slug ON elections(slug);
CREATE INDEX idx_elections_region_id ON elections(region_id);
CREATE INDEX idx_elections_status ON elections(status);
CREATE INDEX idx_elections_is_published ON elections(is_published);
CREATE INDEX idx_election_groups_election_id ON election_groups(election_id);
CREATE INDEX idx_election_candidates_group_id ON election_candidates(group_id);
CREATE INDEX idx_election_updates_election_id ON election_updates(election_id);

-- Policies for elections
CREATE POLICY "Elections are viewable by everyone if published" ON elections FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins have full access to elections" ON elections FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Publishers can view all elections" ON elections FOR SELECT
USING (auth.jwt() ->> 'role' = 'publisher');

CREATE POLICY "Publishers can insert their own elections" ON elections FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "Publishers can update their own elections" ON elections FOR UPDATE
USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by)
WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "Publishers can delete their own elections" ON elections FOR DELETE
USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);


-- Policies for election_groups
CREATE POLICY "Groups are viewable by everyone if election is published" ON election_groups FOR SELECT
USING (EXISTS (SELECT 1 FROM elections WHERE id = election_groups.election_id AND is_published = true));

CREATE POLICY "Admins have full access to election_groups" ON election_groups FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Publishers can view all groups" ON election_groups FOR SELECT
USING (auth.jwt() ->> 'role' = 'publisher');

CREATE POLICY "Publishers can insert their own groups" ON election_groups FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "Publishers can update their own groups" ON election_groups FOR UPDATE
USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by)
WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "Publishers can delete their own groups" ON election_groups FOR DELETE
USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);


-- Policies for election_candidates
CREATE POLICY "Candidates are viewable by everyone if election is published" ON election_candidates FOR SELECT
USING (EXISTS (
    SELECT 1 FROM election_groups eg
    JOIN elections e ON eg.election_id = e.id
    WHERE eg.id = election_candidates.group_id AND e.is_published = true
));

CREATE POLICY "Admins have full access to election_candidates" ON election_candidates FOR ALL
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Publishers can view all candidates" ON election_candidates FOR SELECT
USING (auth.jwt() ->> 'role' = 'publisher');

CREATE POLICY "Publishers can insert their own candidates" ON election_candidates FOR INSERT
WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "Publishers can update their own candidates" ON election_candidates FOR UPDATE
USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by)
WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "Publishers can delete their own candidates" ON election_candidates FOR DELETE
USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);


-- Policies for election_updates
CREATE POLICY "Updates are viewable by everyone if election is published" ON election_updates FOR SELECT
USING (EXISTS (SELECT 1 FROM elections WHERE id = election_updates.election_id AND is_published = true));

WITH CHECK (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

CREATE POLICY "Publishers can delete their own updates" ON election_updates FOR DELETE
USING (auth.jwt() ->> 'role' = 'publisher' AND auth.uid() = created_by);

-- Enable the moddatetime extension if it doesn't exist
CREATE EXTENSION IF NOT EXISTS moddatetime SCHEMA extensions;

-- Triggers for updated_at
CREATE TRIGGER set_elections_updated_at BEFORE UPDATE ON elections FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');
CREATE TRIGGER set_election_groups_updated_at BEFORE UPDATE ON election_groups FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');
CREATE TRIGGER set_election_candidates_updated_at BEFORE UPDATE ON election_candidates FOR EACH ROW EXECUTE FUNCTION extensions.moddatetime('updated_at');
