-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create onboarding table
CREATE TABLE onboarding (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID NOT NULL,
    onboarding_name TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    location TEXT NOT NULL,
    music_platforms TEXT[] NOT NULL
);

-- Create events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID NOT NULL,
    onboarding_name TEXT NOT NULL,
    drop_id TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('thumb_up', 'thumb_down', 'skip'))
);

-- Create surveys table
CREATE TABLE surveys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    session_id UUID NOT NULL,
    onboarding_name TEXT NOT NULL,
    drop_id TEXT NOT NULL,
    visuals_impact INTEGER NOT NULL CHECK (visuals_impact >= 1 AND visuals_impact <= 5),
    comment TEXT
);

-- Enable Row Level Security on all tables
ALTER TABLE onboarding ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;

-- Create policies for onboarding table
CREATE POLICY insert_all ON onboarding FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY read_all ON onboarding FOR SELECT TO anon USING (true);

-- Create policies for events table
CREATE POLICY insert_all ON events FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY read_all ON events FOR SELECT TO anon USING (true);

-- Create policies for surveys table
CREATE POLICY insert_all ON surveys FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY read_all ON surveys FOR SELECT TO anon USING (true);

-- Create indexes for better performance
CREATE INDEX idx_onboarding_session_id ON onboarding(session_id);
CREATE INDEX idx_onboarding_created_at ON onboarding(created_at);
CREATE INDEX idx_events_session_id ON events(session_id);
CREATE INDEX idx_events_drop_id ON events(drop_id);
CREATE INDEX idx_events_created_at ON events(created_at);
CREATE INDEX idx_surveys_session_id ON surveys(session_id);
CREATE INDEX idx_surveys_drop_id ON surveys(drop_id);
CREATE INDEX idx_surveys_created_at ON surveys(created_at);
