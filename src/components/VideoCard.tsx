import { useEffect, useRef, useState } from 'react';
import type { Drop, SurveyData } from '../lib/types';
import { insertSurvey } from '../lib/supabase';

interface VideoCardProps {
  drop: Drop;
  onboardingData: {
    sessionId: string;
    onboardingName: string;
  };
  onNavigateDown?: () => void;
  isLastVideo?: boolean;
  onDone?: () => void;
  currentIndex: number;
  total: number;
}

export default function VideoCard({ 
  drop, 
  onboardingData,
  onNavigateDown,
  isLastVideo = false,
  onDone,
  currentIndex,
  total
}: VideoCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visualsImpact, setVisualsImpact] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, [drop.id]);

  // Reset form when drop changes
  useEffect(() => {
    setVisualsImpact(0);
    setComment('');
  }, [drop.id]);

  const handleNext = async () => {
    if (visualsImpact === 0) {
      alert('Please rate the visual impact before continuing.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const surveyData: SurveyData = {
        sessionId: onboardingData.sessionId,
        onboardingName: onboardingData.onboardingName,
        dropId: drop.id,
        visualsImpact,
        comment: comment.trim() || undefined,
      };

      await insertSurvey(surveyData);
      console.log('Survey submitted for:', drop.id);
      
      // Reset form
      setVisualsImpact(0);
      setComment('');
      
      // Navigate to next video or finish
      if (isLastVideo) {
        onDone?.();
      } else {
        onNavigateDown?.();
      }
    } catch (error) {
      console.error('Failed to submit survey:', error);
      alert('Failed to save your response. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-screen bg-black flex items-center justify-center">
      {/* Video Container - sized to match video content */}
      <div className="relative flex items-center justify-center my-16" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {/* Video Player */}
        <video
          ref={videoRef}
          src={drop.videoUrl}
          className="w-auto h-auto max-w-full max-h-full object-contain transition-all duration-300 ease-in-out"
          style={{ maxHeight: 'calc(100vh - 120px)' }}
          muted={false}
          playsInline
          loop
          autoPlay
          preload="metadata"
        />

        {/* Survey Questions - positioned relative to video */}
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-4 w-72 bg-gray-900 border border-gray-700 rounded-lg p-4">
          <div className="bg-black bg-opacity-80 text-white p-4 rounded-lg">
            {/* Progress Tracker */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-600">
              <div className="text-white font-medium">
                {currentIndex + 1} / {total}
              </div>
              <div className="w-24 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold mb-4 text-center">
              How impactful were the visuals?
            </h3>
            
            {/* Likert Scale */}
            <div className="flex justify-between items-center mb-4">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setVisualsImpact(rating)}
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                    visualsImpact === rating
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-transparent border-gray-400 text-gray-400 hover:border-blue-400 hover:text-blue-400'
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>Not at all</span>
              <span>Very impactful</span>
            </div>
            
            {/* Comment Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Additional comments (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts..."
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>
            
            {/* Next/Done Button */}
            <button
              onClick={handleNext}
              disabled={isSubmitting || visualsImpact === 0}
              className={`w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                isSubmitting || visualsImpact === 0
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isSubmitting ? 'Saving...' : isLastVideo ? 'Finish' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
