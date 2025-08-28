import { createClient } from '@supabase/supabase-js';
import type { OnboardingData, SurveyData } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a mock client if environment variables are missing (for demo/preview purposes)
const isSupabaseConfigured = supabaseUrl && supabaseAnonKey;

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function insertOnboarding(data: OnboardingData) {
  if (!supabase) {
    console.warn('Supabase not configured - skipping onboarding data save');
    return;
  }

  try {
    const { error } = await supabase
      .from('onboarding')
      .insert({
        session_id: data.sessionId,
        onboarding_name: data.onboardingName,
        age: data.age,
        gender: data.gender,
        location: data.location,
        music_platforms: data.musicPlatforms,
      });

    if (error) {
      console.error('Error inserting onboarding data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to insert onboarding data:', error);
    throw error;
  }
}

export async function insertSurvey(data: SurveyData) {
  if (!supabase) {
    console.warn('Supabase not configured - skipping survey data save');
    return;
  }

  try {
    const { error } = await supabase
      .from('surveys')
      .insert({
        session_id: data.sessionId,
        onboarding_name: data.onboardingName,
        drop_id: data.dropId,
        visuals_impact: data.visualsImpact,
        comment: data.comment || null,
      });

    if (error) {
      console.error('Error inserting survey data:', error);
      throw error;
    }
  } catch (error) {
    console.error('Failed to insert survey data:', error);
    throw error;
  }
}

export async function getAllOnboarding() {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('onboarding')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching onboarding data:', error);
    throw error;
  }

  return data;
}

export async function getAllSurveys() {
  if (!supabase) {
    console.warn('Supabase not configured - returning empty array');
    return [];
  }

  const { data, error } = await supabase
    .from('surveys')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching surveys:', error);
    throw error;
  }

  return data;
}
