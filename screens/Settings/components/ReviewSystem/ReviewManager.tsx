// screens/Settings/components/ReviewSystem/ReviewManager.tsx
import React from 'react';
import { Platform } from 'react-native';
import { FeedbackData } from './types';
import { openPlayStoreForRating, sendFeedbackViaEmail, logFeedbackData } from './utils';
import { TEXTS } from './constants';
import { triggerHaptic } from '@/utils/haptics';
import FeedbackBottomSheet from './FeedbackBottomSheet';
import { submitFeedback, type FeedbackInput } from '@/utils/cloudSync/feedbackService';

interface ReviewManagerProps {
  // Is the manager active/visible
  isVisible: boolean;

  // Play Store ID of your app
  appPackageName: string;

  // Email address for feedback
  feedbackEmail: string;

  // Callback when the Review Manager is closed
  onClose: () => void;

  // Callback when rating is submitted to PlayStore
  onPlayStoreRedirect?: () => void;

  // Callback when feedback is sent
  onFeedbackSent?: (data: FeedbackData) => void;

  // Alert function from parent (to avoid context issues)
  showAlert?: (config: any) => void;
}

const ReviewManager: React.FC<ReviewManagerProps> = ({
  isVisible,
  appPackageName,
  feedbackEmail,
  onClose,
  onPlayStoreRedirect,
  onFeedbackSent,
  showAlert
}) => {
  // Handle Play Store redirect (for 5-star ratings)
  const handlePlayStoreRedirect = async () => {
    try {
      const opened = await openPlayStoreForRating(appPackageName);
      if (opened && onPlayStoreRedirect) {
        onPlayStoreRedirect();
      }
    } catch (error) {
      console.error('Error opening Play Store:', error);
    }
  };

  // Handle feedback submission - 3-Tier Fallback Strategy
  const handleFeedbackSubmit = async (data: FeedbackData): Promise<{ queued?: boolean }> => {
    // Log for debugging
    logFeedbackData(data);

    // Haptic Feedback
    triggerHaptic('success');

    // Convert FeedbackData to FeedbackInput
    const feedbackInput: FeedbackInput = {
      rating: data.rating,
      category: data.category,
      details: data.details,
      email: data.email,
    };

    try {
      // TIER 1: Try Firebase upload (direct or offline queue)
      console.log('[ReviewManager] Attempting Firebase upload...');
      const firebaseResult = await submitFeedback(feedbackInput, false);

      // Firebase upload successful (direct or queued)
      if (firebaseResult.success) {
        console.log('[ReviewManager] ✅ Feedback submitted successfully via Firebase');

        // Execute callback
        if (onFeedbackSent) {
          onFeedbackSent(data);
        }

        // Return result with queued status
        return { queued: firebaseResult.queued };
      }

      // TIER 2: Firebase failed, try email fallback
      console.warn('[ReviewManager] Firebase upload failed, trying email fallback...');
      const emailSent = await sendFeedbackViaEmail(data, feedbackEmail);

      if (emailSent) {
        // Email sent successfully - now upload to Firebase with sentViaEmail flag
        console.log('[ReviewManager] Email sent, uploading to Firebase with email flag...');
        try {
          await submitFeedback(feedbackInput, true);
        } catch (err) {
          console.warn('[ReviewManager] Could not upload email-sent feedback to Firebase:', err);
        }

        // Execute callback
        if (onFeedbackSent) {
          onFeedbackSent(data);
        }

        // Return result (email was sent, so not queued)
        return { queued: false };
      }

      // TIER 3: Both Firebase and Email failed
      console.error('[ReviewManager] ❌ All feedback methods failed');
      if (showAlert) {
        showAlert({
          title: 'Fehler beim Senden',
          message: `Keine E-Mail-App gefunden. Bitte sende dein Feedback an: ${feedbackEmail}`,
          type: 'warning',
          buttons: [
            {
              text: 'OK',
              onPress: onClose,
              style: 'primary'
            }
          ],
        });
      } else {
        onClose();
      }
      throw new Error('All feedback methods failed');
    } catch (error) {
      console.error('[ReviewManager] ❌ Error in feedback submission:', error);

      // Try email as last resort
      try {
        const emailSent = await sendFeedbackViaEmail(data, feedbackEmail);
        if (emailSent) {
          // Email sent successfully
          if (onFeedbackSent) {
            onFeedbackSent(data);
          }

          if (showAlert) {
            showAlert({
              title: TEXTS.FEEDBACK_SENT_TITLE,
              message: TEXTS.FEEDBACK_SENT_SUBTITLE,
              type: 'success',
              buttons: [
                {
                  text: TEXTS.FEEDBACK_SENT_BUTTON,
                  onPress: onClose,
                  style: 'primary'
                }
              ],
            });
          } else {
            onClose();
          }
          return { queued: false };
        }
      } catch (emailError) {
        console.error('[ReviewManager] Email fallback also failed:', emailError);
      }

      // Final error - nothing worked
      if (showAlert) {
        showAlert({
          title: 'Fehler',
          message: 'Beim Senden des Feedbacks ist ein Fehler aufgetreten. Bitte versuche es später erneut.',
          type: 'error',
          buttons: [
            {
              text: 'OK',
              onPress: onClose,
              style: 'primary'
            }
          ],
        });
      } else {
        onClose();
      }
      throw new Error('Failed to submit feedback');
    }
  };

  return (
    <FeedbackBottomSheet
      visible={isVisible}
      onClose={onClose}
      onFeedbackSubmit={handleFeedbackSubmit}
      onPlayStoreRedirect={handlePlayStoreRedirect}
    />
  );
};

export default ReviewManager;
