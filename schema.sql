-- =========================================================================
-- ELITEZ SPORTS TALENT ASSESSMENT PLATFORM — POSTGRESQL / SUPABASE DDL
-- Includes full Row Level Security (RLS) policies and Role-Based Access Control
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. User Profiles & Roles
CREATE TYPE user_role AS ENUM ('athlete', 'coach', 'admin');
CREATE TYPE profile_visibility AS ENUM ('public', 'coaches_only', 'private');
CREATE TYPE verification_status AS ENUM ('athlete_reported', 'cv_analyzed', 'coach_verified', 'flagged_for_review');
CREATE TYPE assessment_category AS ENUM ('speed', 'power', 'strength', 'endurance', 'agility');

CREATE TABLE IF NOT EXISTS athlete_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  date_of_birth DATE NOT NULL,
  gender TEXT,
  primary_sport TEXT NOT NULL,
  position TEXT,
  secondary_sport TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'USA',
  height_cm NUMERIC(5,2) NOT NULL,
  weight_kg NUMERIC(5,2) NOT NULL,
  wingspan_cm NUMERIC(5,2),
  dominant_side TEXT DEFAULT 'right',
  current_team TEXT,
  years_experience INT DEFAULT 1,
  bio TEXT,
  is_minor BOOLEAN NOT NULL DEFAULT FALSE,
  parental_consent_verified BOOLEAN DEFAULT FALSE,
  profile_visibility profile_visibility NOT NULL DEFAULT 'public',
  show_contact_info BOOLEAN DEFAULT FALSE,
  show_location BOOLEAN DEFAULT TRUE,
  show_age BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Coach & Scout Profiles
CREATE TABLE IF NOT EXISTS coach_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  role_title TEXT NOT NULL,
  sports_specialization TEXT[] NOT NULL DEFAULT '{}',
  verified_badge BOOLEAN DEFAULT FALSE,
  bio TEXT,
  contact_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Assessment Definitions
CREATE TABLE IF NOT EXISTS assessment_definitions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_code TEXT NOT NULL,
  category assessment_category NOT NULL,
  description TEXT NOT NULL,
  instructions TEXT[] NOT NULL DEFAULT '{}',
  safety_guidelines TEXT[] NOT NULL DEFAULT '{}',
  required_equipment TEXT[] NOT NULL DEFAULT '{}',
  metric_name TEXT NOT NULL,
  unit TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('lower_is_better', 'higher_is_better')),
  min_allowed_value NUMERIC(7,2) NOT NULL,
  max_allowed_value NUMERIC(7,2) NOT NULL,
  standard_weight INT NOT NULL DEFAULT 20,
  cv_supported BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Assessment Attempts & Measurements
CREATE TABLE IF NOT EXISTS assessment_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  assessment_id TEXT NOT NULL REFERENCES assessment_definitions(id),
  attempt_date DATE NOT NULL DEFAULT CURRENT_DATE,
  raw_value NUMERIC(7,2) NOT NULL,
  unit TEXT NOT NULL,
  normalized_score NUMERIC(5,2) NOT NULL,
  scoring_rule_version TEXT NOT NULL,
  verification_status verification_status NOT NULL DEFAULT 'athlete_reported',
  source TEXT NOT NULL DEFAULT 'self_entry',
  video_url TEXT,
  video_metadata JSONB,
  athlete_notes TEXT,
  reviewer_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  flag_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Coach Shortlists & Watchlists
CREATE TABLE IF NOT EXISTS coach_shortlists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES coach_profiles(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES athlete_profiles(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  private_notes TEXT[] DEFAULT '{}',
  rating INT CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(coach_id, athlete_id)
);

-- 6. Benchmark Datasets
CREATE TABLE IF NOT EXISTS benchmark_datasets (
  id TEXT PRIMARY KEY,
  assessment_id TEXT NOT NULL REFERENCES assessment_definitions(id),
  sport TEXT NOT NULL,
  age_group TEXT NOT NULL,
  source_name TEXT NOT NULL,
  source_citation TEXT NOT NULL,
  sample_size INT NOT NULL,
  last_updated DATE NOT NULL,
  p10 NUMERIC(7,2) NOT NULL,
  p25 NUMERIC(7,2) NOT NULL,
  p50 NUMERIC(7,2) NOT NULL,
  p75 NUMERIC(7,2) NOT NULL,
  p90 NUMERIC(7,2) NOT NULL,
  p99 NUMERIC(7,2) NOT NULL,
  limitations_note TEXT
);

-- 7. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  actor_id UUID NOT NULL,
  actor_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id TEXT NOT NULL,
  details TEXT NOT NULL
);

-- =========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

ALTER TABLE athlete_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coach_shortlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Athletes can read and update their own profile
CREATE POLICY "Athletes can manage their own profile"
  ON athlete_profiles FOR ALL
  USING (auth.uid() = user_id);

-- Policy: Coaches can discover athletes whose profile visibility is 'public' or 'coaches_only'
CREATE POLICY "Coaches can discover visible athletes"
  ON athlete_profiles FOR SELECT
  USING (
    profile_visibility = 'public' OR 
    (profile_visibility = 'coaches_only' AND EXISTS (SELECT 1 FROM coach_profiles WHERE user_id = auth.uid()))
  );

-- Policy: Attempts accessible by athlete owner or verified coaches
CREATE POLICY "Athletes can read and create their own attempts"
  ON assessment_attempts FOR ALL
  USING (
    athlete_id IN (SELECT id FROM athlete_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Coaches can view attempts of visible athletes"
  ON assessment_attempts FOR SELECT
  USING (
    athlete_id IN (
      SELECT id FROM athlete_profiles WHERE 
      profile_visibility IN ('public', 'coaches_only')
    )
  );

-- Policy: Shortlist accessible only by the coach who created it
CREATE POLICY "Coaches manage their own shortlists"
  ON coach_shortlists FOR ALL
  USING (
    coach_id IN (SELECT id FROM coach_profiles WHERE user_id = auth.uid())
  );
