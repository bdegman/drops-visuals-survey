import { HashRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import OnboardingForm from './components/OnboardingForm';
import Feed from './routes/Feed';
import Admin from './routes/Admin';
import type { Drop, OnboardingData } from './lib/types';
import { loadDrops, shuffleDrops } from './data/loadDrops';
import { insertOnboarding } from './lib/supabase';

// Zod schema for onboarding form validation
export const onboardingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.number().min(1, 'Age must be at least 1').max(120, 'Age must be less than 120'),
  gender: z.string().min(1, 'Gender is required'),
  location: z.string().min(1, 'Location is required'),
  musicPlatformUsage: z.array(z.string()).min(1, 'Please select at least one music platform'),
});

export type OnboardingFormData = z.infer<typeof onboardingSchema>;

interface AppState {
  sessionId: string;
  onboardingData: OnboardingData | null;
  drops: Drop[];
  isLoading: boolean;
  error: string | null;
}

function App() {
  const [state, setState] = useState<AppState>({
    sessionId: uuidv4(),
    onboardingData: null,
    drops: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function initializeApp() {
      try {
        const allDrops = await loadDrops();
        const shuffledDrops = shuffleDrops(allDrops);
        setState(prev => ({
          ...prev,
          drops: shuffledDrops,
          isLoading: false,
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load drops',
          isLoading: false,
        }));
      }
    }

    initializeApp();
  }, []);

  const handleOnboardingSubmit = async (formData: OnboardingFormData) => {
    const onboardingData: OnboardingData = {
      sessionId: state.sessionId,
      onboardingName: formData.name,
      age: formData.age,
      gender: formData.gender,
      location: formData.location,
      musicPlatforms: formData.musicPlatformUsage,
    };

    try {
      await insertOnboarding(onboardingData);
      setState(prev => ({
        ...prev,
        onboardingData,
      }));
    } catch (error) {
      console.error('Failed to save onboarding data:', error);
      // Still proceed with the app even if save fails
      setState(prev => ({
        ...prev,
        onboardingData,
      }));
    }
  };

  if (state.isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{state.error}</div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-900">
        <Routes>
          <Route 
            path="/" 
            element={
              state.onboardingData && state.drops.length > 0 ? (
                <Feed 
                  drops={state.drops}
                  onboardingData={state.onboardingData}
                />
              ) : (
                <OnboardingForm onSubmit={handleOnboardingSubmit} />
              )
            } 
          />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
