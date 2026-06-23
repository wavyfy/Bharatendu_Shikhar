-- Add legal and policy text fields
ALTER TABLE settings 
ADD COLUMN about_us TEXT DEFAULT NULL,
ADD COLUMN privacy_policy TEXT DEFAULT NULL,
ADD COLUMN terms_conditions TEXT DEFAULT NULL,
ADD COLUMN editorial_policy TEXT DEFAULT NULL,
ADD COLUMN correction_policy TEXT DEFAULT NULL;
