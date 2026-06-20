-- Create advertisements table
CREATE TABLE public.advertisements (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    advertiser_name text not null,
    advertiser_phone text,
    image_url text not null,
    redirect_url text,
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    is_active boolean not null default true,
    created_by uuid not null references public.profiles(id),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),

    -- Constraints
    CONSTRAINT advertisements_dates_check CHECK (end_date > start_date),
    CONSTRAINT advertisements_url_check CHECK (redirect_url IS NULL OR redirect_url ~ '^https?://')
);

-- Indexes
CREATE INDEX idx_advertisements_is_active ON public.advertisements(is_active);
CREATE INDEX idx_advertisements_start_date ON public.advertisements(start_date);
CREATE INDEX idx_advertisements_end_date ON public.advertisements(end_date);
CREATE INDEX idx_advertisements_created_by ON public.advertisements(created_by);

-- Enable RLS
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

-- Grant API access
GRANT ALL ON TABLE public.advertisements TO anon;
GRANT ALL ON TABLE public.advertisements TO authenticated;
GRANT ALL ON TABLE public.advertisements TO service_role;

-- RLS Policies for Table

-- Admin: full access
CREATE POLICY "Admins have full access to advertisements" ON public.advertisements
    FOR ALL USING (public.is_admin());

-- Publisher: access own records
CREATE POLICY "Publishers can view their own advertisements" ON public.advertisements
    FOR SELECT USING (
        created_by = auth.uid() AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'publisher')
    );

CREATE POLICY "Publishers can insert their own advertisements" ON public.advertisements
    FOR INSERT WITH CHECK (
        created_by = auth.uid() AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'publisher')
    );

CREATE POLICY "Publishers can update their own advertisements" ON public.advertisements
    FOR UPDATE USING (
        created_by = auth.uid() AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'publisher')
    );

CREATE POLICY "Publishers can delete their own advertisements" ON public.advertisements
    FOR DELETE USING (
        created_by = auth.uid() AND 
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'publisher')
    );

-- Ensure function exists for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for updated_at
CREATE TRIGGER set_advertisements_updated_at
    BEFORE UPDATE ON public.advertisements
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Setup Storage Bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('advertisements', 'advertisements', true, 5242880, '{"image/jpeg","image/jpg","image/png","image/webp"}');

-- Storage RLS Policies

-- Public can read
CREATE POLICY "Public can view advertisement images" ON storage.objects
    FOR SELECT USING (bucket_id = 'advertisements');

-- Admins can insert/update/delete any file
CREATE POLICY "Admins can manage all advertisement images" ON storage.objects
    FOR ALL USING (
        bucket_id = 'advertisements' AND public.is_admin()
    );

-- Publishers can insert their own files (path format: advertisements/user_id/filename)
CREATE POLICY "Publishers can upload their own images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'advertisements' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'publisher')
    );

CREATE POLICY "Publishers can update their own images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'advertisements' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'publisher')
    );

CREATE POLICY "Publishers can delete their own images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'advertisements' AND
        (storage.foldername(name))[1] = auth.uid()::text AND
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'publisher')
    );
