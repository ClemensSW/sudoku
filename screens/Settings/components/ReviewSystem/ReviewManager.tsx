// screens/Settings/components/ReviewSystem/ReviewManager.tsx
import React from 'react';
import { Platform } from 'react-native';
import { FeedbackData } from './types';
import { openPlayStoreForRating, sendFeedbackViaEmail, logFeedbackData } from './utils';
import { TEXTS } from './constants';
import { triggerHaptic } from '@/utils/haptics';
import FeedbackBottomSheet from './FeedbackBottomSheet';

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

  // Handle feedback submission
  const handleFeedbackSubmit = async (data: FeedbackData) => {
    // Log for debugging
    logFeedbackData(data);

    // Haptic Feedback
    triggerHaptic('success');

    try {
      // Send feedback via email (fallback for now, Firebase in Phase 2)
      const sent = await sendFeedbackViaEmail(data, feedbackEmail);

      // Execute callback if present
      if (onFeedbackSent) {
        onFeedbackSent(data);
      }

      // Show success or error message
      if (sent) {
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
      } else {
        // If no email app is available
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
      }
    } catch (error) {
      console.error('Error sending feedback:', error);

      // Show error message
      if (showAlert) {
        showAlert({
          title: 'Fehler',
          message: 'Beim Senden des Feedbacks ist ein Fehler aufgetreten.',
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
