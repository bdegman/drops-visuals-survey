import { useState, useCallback } from 'react';
import VideoCard from '../components/VideoCard';
import type { Drop, OnboardingData } from '../lib/types';

interface FeedProps {
  drops: Drop[];
  onboardingData: OnboardingData;
}

export default function Feed({ drops, onboardingData }: FeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentDrop = drops[currentIndex];
  const isLastVideo = currentIndex === drops.length - 1;

  const navigateToNext = useCallback(() => {
    if (!currentDrop || isTransitioning) return;
    
    setIsTransitioning(true);
    
    if (currentIndex < drops.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
    
    // Reset transition state after animation
    setTimeout(() => setIsTransitioning(false), 300);
  }, [currentIndex, drops.length, currentDrop, isTransitioning]);

  const handleDone = () => {
    // Show completion message and redirect to onboarding
    alert('Thank you for participating! Your responses have been recorded.');
    window.location.reload(); // Restart the app
  };

  if (!currentDrop) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">No videos available</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black">
      <VideoCard
        drop={currentDrop}
        onboardingData={onboardingData}
        onNavigateDown={navigateToNext}
        isLastVideo={isLastVideo}
        onDone={handleDone}
        currentIndex={currentIndex}
        total={drops.length}
      />
    </div>
  );
}
