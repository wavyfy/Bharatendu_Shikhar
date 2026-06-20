-- Create advertisement_placements table
CREATE TABLE public.advertisement_placements (
    id uuid primary key default gen_random_uuid(),
    advertisement_id uuid not null references public.advertisements(id) on delete cascade,
    slot_identifier text not null,
    created_at timestamp with time zone not null default now(),
    UNIQUE(advertisement_id, slot_identifier)
);

-- Indexes
CREATE INDEX idx_adv_placements_adv_id ON public.advertisement_placements(advertisement_id);
CREATE INDEX idx_adv_placements_slot_id ON public.advertisement_placements(slot_identifier);

-- Enable RLS
ALTER TABLE public.advertisement_placements ENABLE ROW LEVEL SECURITY;

-- Grant API access
GRANT ALL ON TABLE public.advertisement_placements TO anon;
GRANT ALL ON TABLE public.advertisement_placements TO authenticated;
GRANT ALL ON TABLE public.advertisement_placements TO service_role;

-- RLS Policies

-- Admin: full access
CREATE POLICY "Admins have full access to advertisement_placements" ON public.advertisement_placements
    FOR ALL USING (public.is_admin());

-- Publishers can view placements for their ads
CREATE POLICY "Publishers can view placements for their ads" ON public.advertisement_placements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.advertisements a 
            WHERE a.id = advertisement_placements.advertisement_id 
            AND a.created_by = auth.uid()
        )
    );

CREATE POLICY "Publishers can insert placements for their ads" ON public.advertisement_placements
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.advertisements a 
            WHERE a.id = advertisement_placements.advertisement_id 
            AND a.created_by = auth.uid()
        )
    );

CREATE POLICY "Publishers can delete placements for their ads" ON public.advertisement_placements
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.advertisements a 
            WHERE a.id = advertisement_placements.advertisement_id 
            AND a.created_by = auth.uid()
        )
    );

-- Function to get occupied slots
CREATE OR REPLACE FUNCTION public.get_occupied_slots(p_start_date timestamp with time zone, p_end_date timestamp with time zone, p_exclude_ad_id uuid DEFAULT NULL)
RETURNS TABLE (slot_identifier text) AS $$
BEGIN
    RETURN QUERY
    SELECT DISTINCT ap.slot_identifier
    FROM public.advertisement_placements ap
    JOIN public.advertisements a ON a.id = ap.advertisement_id
    WHERE a.is_active = true
      AND (
          a.start_date <= p_end_date AND a.end_date >= p_start_date
      )
      AND (p_exclude_ad_id IS NULL OR a.id != p_exclude_ad_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.get_occupied_slots(timestamp with time zone, timestamp with time zone, uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.get_occupied_slots(timestamp with time zone, timestamp with time zone, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_occupied_slots(timestamp with time zone, timestamp with time zone, uuid) TO service_role;
