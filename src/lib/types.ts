export interface Drop {
  id: string;
  track: string;
  artist: string;
  videoUrl: string;
  durationSec: number;
}

export interface OnboardingData {
  sessionId: string;
  onboardingName: string;
  age: number;
  gender: string;
  location: string;
  musicPlatforms: string[];
}

export interface SurveyData {
  sessionId: string;
  onboardingName: string;
  dropId: string;
  visualsImpact: number;
  comment?: string;
}

export interface OnboardingFormData {
  name: string;
  age: number;
  gender: string;
  location: string;
  musicPlatformUsage: string[];
}
