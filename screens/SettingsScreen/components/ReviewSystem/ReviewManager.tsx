// components/ReviewSystem/ReviewManager.tsx

import React, { useState, useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import RatingModal from './RatingModal';
import FeedbackCategoryModal from './FeedbackCategoryModal';
import FeedbackDetailModal from './FeedbackDetailModal';
import { FeedbackData, Rating, FeedbackCategory } from './types';
import { openPlayStoreForRating, sendFeedbackViaEmail, logFeedbackData } from './utils';
import { TEXTS } from './constants';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import { triggerHaptic } from '@/utils/haptics';

interface ReviewManagerProps {
  // Ist der Manager aktiv/sichtbar
  isVisible: boolean;
  
  // Play Store ID deiner App
  appPackageName: string;
  
  // Email-Adresse für Feedback
  feedbackEmail: string;
  
  // Callback wenn der Review Manager geschlossen wird
  onClose: () => void;
  
  // Callback wenn Bewertung auf PlayStore abgegeben wird
  onPlayStoreRedirect?: () => void;
  
  // Callback wenn Feedback abgesendet wird
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
  // State für die verschiedenen Modals
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  // Bewertungsdaten
  const [rating, setRating] = useState<Rating | null>(null);
  const [category, setCategory] = useState<FeedbackCategory | null>(null);
  
  // Custom Alert für Erfolgs-/Fehlermeldungen
  const { showAlert } = useAlert();

  // Initial anzeigen, wenn isVisible true ist
  useEffect(() => {
    if (isVisible) {
      setShowRatingModal(true);
    } else {
      resetAll();
    }
  }, [isVisible]);

  // Zurücksetzen aller States
  const resetAll = () => {
    setShowRatingModal(false);
    setShowCategoryModal(false);
    setShowFeedbackModal(false);
    setRating(null);
    setCategory(null);
  };

  // Hauptschließen-Funktion
  const handleClose = () => {
    resetAll();
    onClose();
  };

  // Bewertungsmodal: Bewertung ausgewählt
  const handleRate = async (selectedRating: Rating) => {
    setRating(selectedRating);
    
    // Nur 5-Sterne-Bewertungen gehen zum Play Store
    if (selectedRating === 5) {
      triggerHaptic('success');
      setShowRatingModal(false);
      
      try {
        const opened = await openPlayStoreForRating(appPackageName);
        if (opened && onPlayStoreRedirect) {
          onPlayStoreRedirect();
        }
      } catch (error) {
        console.error('Fehler beim Öffnen des Play Store:', error);
      }
      
      // Nach kurzer Verzögerung alles zurücksetzen
      setTimeout(() => {
        handleClose();
      }, 500);
    } 
    // Bei 4 Sternen: Danke & schließen
    else if (selectedRating === 4) {
      triggerHaptic('success');
      setShowRatingModal(false);
      
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
    }
    // 1-3 Sterne: Zur Kategorie-Auswahl
    else {
      triggerHaptic('warning');
      setShowRatingModal(false);
      
      // Kleine Verzögerung für bessere UX
      setTimeout(() => {
        setShowCategoryModal(true);
      }, 300);
    }
  };

  // Kategoriemodal: Kategorie ausgewählt
  const handleSelectCategory = (selectedCategory: FeedbackCategory) => {
    setCategory(selectedCategory);
    setShowCategoryModal(false);
    
    // Kleine Verzögerung für bessere UX
    setTimeout(() => {
      setShowFeedbackModal(true);
    }, 300);
  };

  // Feedbackmodal: Feedback abgesendet
  const handleSubmitFeedback = async (data: FeedbackData) => {
    // Log für Debugging
    logFeedbackData(data);
    
    // Modal schließen
    setShowFeedbackModal(false);
    
    // Haptic Feedback
    triggerHaptic('success');
    
    try {
      // Feedback per E-Mail senden
      const sent = await sendFeedbackViaEmail(data, feedbackEmail);
      
      // Callback ausführen, wenn vorhanden
      if (onFeedbackSent) {
        onFeedbackSent(data);
      }
      
      // Erfolgs- oder Fehlermeldung anzeigen
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
        // Wenn keine E-Mail-App verfügbar ist
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
      console.error('Fehler beim Senden des Feedbacks:', error);
      
      // Fehlermeldung anzeigen
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
      <FeedbackDetailModal
        visible={showFeedbackModal}
        category={category}
        rating={rating || 0}
        onClose={handleClose}
        onSubmit={handleSubmitFeedback}
      />
    </>
  );
};

export default ReviewManager;