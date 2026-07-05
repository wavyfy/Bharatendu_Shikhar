-- Migration to add parent_id to regions for sub-regions support
ALTER TABLE "public"."regions" ADD COLUMN "parent_id" int4 REFERENCES "public"."regions"("id") ON DELETE SET NULL;
