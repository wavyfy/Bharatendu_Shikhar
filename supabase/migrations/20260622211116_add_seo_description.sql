-- Add seo_description column to categories and regions tables
ALTER TABLE categories ADD COLUMN seo_description text;
ALTER TABLE regions ADD COLUMN seo_description text;
