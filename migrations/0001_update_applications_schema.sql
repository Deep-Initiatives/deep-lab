-- Update applications table schema
-- Remove old columns and add new ones

-- First, drop the old columns
ALTER TABLE applications DROP COLUMN IF EXISTS experience;
ALTER TABLE applications DROP COLUMN IF EXISTS skills;
ALTER TABLE applications DROP COLUMN IF EXISTS linkedin;
ALTER TABLE applications DROP COLUMN IF EXISTS github;
ALTER TABLE applications DROP COLUMN IF EXISTS portfolio;
ALTER TABLE applications DROP COLUMN IF EXISTS motivation;
ALTER TABLE applications DROP COLUMN IF EXISTS availability;

-- Add new columns
ALTER TABLE applications ADD COLUMN mattermost_handle TEXT NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN circles JSON DEFAULT '[]';
ALTER TABLE applications ADD COLUMN meets_requirements TEXT NOT NULL DEFAULT '';
ALTER TABLE applications ADD COLUMN currently_in_circle TEXT NOT NULL DEFAULT '';

-- Update existing records to have default values (if any exist)
UPDATE applications SET 
  mattermost_handle = 'N/A',
  meets_requirements = 'N/A',
  currently_in_circle = 'N/A'
WHERE mattermost_handle = '' OR meets_requirements = '' OR currently_in_circle = '';

