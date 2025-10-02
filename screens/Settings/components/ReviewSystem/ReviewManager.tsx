// screens/SettingsScreen/components/ReviewSystem/ReviewManager.tsx
import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import RatingModal from './RatingModal';
import FeedbackCategoryModal from './FeedbackCategoryModal';
import FeedbackDetailModal from './FeedbackDetailModal';
import { FeedbackData, Rating, FeedbackCategory } from './types';
import { openPlayStoreForRating, sendFeedbackViaEmail, logFeedbackData } from './utils';
import { TEXTS } from './constants';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import { triggerHaptic } from '@/utils/haptics';

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
}

const ReviewManager: React.FC<ReviewManagerProps> = ({
  isVisible,
  appPackageName,
  feedbackEmail,
  onClose,
  onPlayStoreRedirect,
  onFeedbackSent
}) => {
  // State for the different modals
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Rating data
  const [rating, setRating] = useState<Rating | null>(null);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  
  // Custom Alert for success/error messages
  const { showAlert } = useAlert();

  // Show initially when isVisible is true
  useEffect(() => {
    if (isVisible) {
      setShowRatingModal(true);
    } else {
      resetAll();
    }
  }, [isVisible]);

  // Reset all states
  const resetAll = () => {
    setShowRatingModal(false);
    setShowCategoryModal(false);
    setShowFeedbackModal(false);
    setRating(null);
    setCategory(null);
  };

  // Main close function
  const handleClose = () => {
    resetAll();
    onClose();
  };

  // Rating modal: Rating selected
  const handleRate = async (selectedRating: Rating) => {
    setRating(selectedRating);
    
    // Only 5-star ratings go directly to Play Store
    if (selectedRating === 5) {
      triggerHaptic('success');
      setShowRatingModal(false);
      
      try {
        const opened = await openPlayStoreForRating(appPackageName);
        if (opened && onPlayStoreRedirect) {
          onPlayStoreRedirect();
        }
      } catch (error) {
        console.error('Error opening Play Store:', error);
      }
      
      // Reset after a short delay
      setTimeout(() => {
        handleClose();
      }, 500);
    } 
    // 1-4 stars: Go to category selection for more detailed feedback
    else {
      triggerHaptic(selectedRating === 4 ? 'light' : 'warning');
      setShowRatingModal(false);
      
      // Small delay for better UX
      setTimeout(() => {
        setShowCategoryModal(true);
      }, 300);
    }
  };

  // Category modal: Category selected
  const handleSelectCategory = (selectedCategory: FeedbackCategory) => {
    setCategory(selectedCategory);
    setShowCategoryModal(false);
    
    // Small delay for better UX
    setTimeout(() => {
      setShowFeedbackModal(true);
    }, 300);
  };

  // Feedback modal: Feedback submitted
  const handleSubmitFeedback = async (data: FeedbackData) => {
    // Log for debugging
    logFeedbackData(data);
    
    // Close modal
    setShowFeedbackModal(false);
    
    // Haptic Feedback
    triggerHaptic('success');
    
    try {
      // Send feedback via email
      const sent = await sendFeedbackViaEmail(data, feedbackEmail);
      
      // Execute callback if present
      if (onFeedbackSent) {
        onFeedbackSent(data);
      }
      
      // Show success or error message
      if (sent) {
        showAlert({
          title: TEXTS.FEEDBACK_SENT_TITLE,
          message: TEXTS.FEEDBACK_SENT_SUBTITLE,
          type: 'success',
          buttons: [
            {
              text: TEXTS.FEEDBACK_SENT_BUTTON,
              onPress: handleClose,
              style: 'primary'
            }
          ],
        });
      } else {
        // If no email app is available
        showAlert({
          title: 'Feedback konnte nicht gesendet werden',
          message: `Bitte sende dein Feedback direkt an: ${feedbackEmail}`,
          type: 'warning',
          buttons: [
            {
              text: 'OK',
              onPress: handleClose,
              style: 'primary'
            }
          ],
        });
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
      
      // Show error message
      showAlert({
        title: 'Ein Fehler ist aufgetreten',
        message: 'Dein Feedback konnte leider nicht gesendet werden. Bitte versuche es später noch einmal.',
        type: 'error',
        buttons: [
          {
            text: 'OK',
            onPress: handleClose,
            style: 'primary'
          }
        ],
      });
    }
  };

  return (
    <>
      {/* Rating Modal */}
      <RatingModal
        visible={showRatingModal}
        onClose={handleClose}
        onRate={handleRate}
      />
      
      {/* Category Selection Modal */}
      <FeedbackCategoryModal
        visible={showCategoryModal}
        onClose={handleClose}
        onSelectCategory={handleSelectCategory}
      />
      
      {/* Feedback Detail Modal */}
      {rating && (
        <FeedbackDetailModal
          visible={showFeedbackModal}
          category={category}
          rating={rating}
          onClose={handleClose}
          onSubmit={handleSubmitFeedback}
        />
      )}
    </>
  );
};

export default ReviewManager;