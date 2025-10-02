// components/ReviewSystem/useReviewManager.ts

import { useState, useCallback } from 'react';
import { FeedbackData } from './types';

interface UseReviewManagerOptions {
  // Play Store App ID (z.B. 'de.playfusiongate.sudokuduo')
  appPackageName: string;
  
  // E-Mail-Adresse für Feedback
  feedbackEmail: string;
  
  // Optional: Callback nach Play Store Weiterleitung
  onPlayStoreRedirect?: () => void;
  
  // Optional: Callback nach Feedback-Versand
  onFeedbackSent?: (data: FeedbackData) => void;

  // Optional: Analytics-Tracking
  trackEvent?: (event: string, properties?: any) => void;
}

export function useReviewManager({
  appPackageName,
  feedbackEmail,
  onPlayStoreRedirect,
  onFeedbackSent,
  trackEvent
}: UseReviewManagerOptions) {
  // Visibility State
  const [isReviewVisible, setReviewVisible] = useState(false);

  // Show the review manager
  const showReview = useCallback(() => {
    setReviewVisible(true);
    if (trackEvent) {
      trackEvent('review_prompt_shown');
    }
  }, [trackEvent]);

  // Hide the review manager
  const hideReview = useCallback(() => {
    setReviewVisible(false);
  }, []);

  // Handler for Play Store redirection
  const handlePlayStoreRedirect = useCallback(() => {
    if (trackEvent) {
      trackEvent('review_redirected_to_play_store', { rating: 5 });
    }
    
    if (onPlayStoreRedirect) {
      onPlayStoreRedirect();
    }
  }, [onPlayStoreRedirect, trackEvent]);

  // Handler for feedback sent
  const handleFeedbackSent = useCallback((data: FeedbackData) => {
    if (trackEvent) {
      trackEvent('feedback_sent', {
        rating: data.rating,
        category: data.category || 'none',
        hasDetails: Boolean(data.details),
        hasEmail: Boolean(data.email)
      });
    }
    
    if (onFeedbackSent) {
      onFeedbackSent(data);
    }
  }, [onFeedbackSent, trackEvent]);

  // Props für den ReviewManager
  const reviewManagerProps = {
    isVisible: isReviewVisible,
    appPackageName,
    feedbackEmail,
    onClose: hideReview,
    onPlayStoreRedirect: handlePlayStoreRedirect,
    onFeedbackSent: handleFeedbackSent
  };

  return {
    isReviewVisible,
    showReview,
    hideReview,
    reviewManagerProps
  };
}

export default useReviewManager;