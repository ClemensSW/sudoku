// components/ReviewSystem/RatingModal.tsx

import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles, getThemeStyles, getEmojiBackgroundColor, getEmojiColor } from './styles';
import { Rating } from './types';
import { TEXTS, RATING_EMOJIS } from './constants';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onRate: (rating: Rating) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ visible, onClose, onRate }) => {
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [starAnimations] = useState(
    Array(5).fill(0).map(() => new Animated.Value(0))
  );
  const theme = useTheme();
  const themeStyles = getThemeStyles(theme.isDark);

  // Emoji und Texte basierend auf der Bewertung
  const getEmojiName = () => {
    if (!selectedRating) return 'star';
    
    if (selectedRating === 5) return RATING_EMOJIS.FIVE_STARS;
    if (selectedRating === 4) return RATING_EMOJIS.FOUR_STARS;
    if (selectedRating === 3) return RATING_EMOJIS.THREE_STARS;
    if (selectedRating === 2) return RATING_EMOJIS.TWO_STARS;
    return RATING_EMOJIS.ONE_STAR;
  };

  // Animiere die Sterne beim Erscheinen
  useEffect(() => {
    if (visible) {
      starAnimations.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          delay: 100 + index * 50,
          useNativeDriver: true,
          tension: 150,
          friction: 8
        }).start();
      });
    } else {
      // Reset Animationen und Bewertung beim Schließen
      starAnimations.forEach(anim => {
        anim.setValue(0);
      });
      setSelectedRating(null);
    }
  }, [visible, starAnimations]);

  // Stern drücken
  const handleStarPress = (rating: Rating) => {
    triggerHaptic('light');
    setSelectedRating(rating);
  };

  // Bewertung absenden
  const handleSubmit = () => {
    if (selectedRating) {
      triggerHaptic('medium');
      onRate(selectedRating);
    }
  };

  // Rendere Sterne
  const renderStars = () => {
    return Array(5).fill(0).map((_, index) => {
      const rating = (index + 1) as Rating;
      const isFilled = selectedRating !== null && rating <= selectedRating;
      
      return (
        <Animated.View
          key={index}
          style={{
            transform: [
              { scale: starAnimations[index] },
              { rotate: starAnimations[index].interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '0deg']
              })}
            ]
          }}
        >
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => handleStarPress(rating)}
            activeOpacity={0.7}
          >
            <Feather
              name={isFilled ? 'star' : 'star'}
              size={36}
              color={isFilled ? getEmojiColor(selectedRating || 5) : themeStyles.borderColor}
              style={{ opacity: isFilled ? 1 : 0.5 }}
            />
          </TouchableOpacity>
        </Animated.View>
      );
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={[
              styles.modalContainer,
              { backgroundColor: themeStyles.background }
            ]}>
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <Feather name="x" size={24} color={themeStyles.secondaryText} />
              </TouchableOpacity>

              {/* Emoji */}
              <View style={[
                styles.emojiContainer,
                { backgroundColor: getEmojiBackgroundColor(selectedRating || 5) }
              ]}>
                <Feather
                  name={getEmojiName()}
                  size={40}
                  color={getEmojiColor(selectedRating || 5)}
                />
              </View>

              {/* Text */}
              <Text style={[styles.titleText, { color: themeStyles.text }]}>
                {selectedRating && (selectedRating >= 4) 
                  ? TEXTS.POSITIVE_TITLE 
                  : selectedRating && selectedRating <= 3 
                    ? TEXTS.NEGATIVE_TITLE 
                    : TEXTS.RATING_TITLE}
              </Text>
              
              <Text style={[styles.subtitleText, { color: themeStyles.secondaryText }]}>
                {selectedRating && (selectedRating >= 4) 
                  ? TEXTS.POSITIVE_SUBTITLE 
                  : selectedRating && selectedRating <= 3 
                    ? TEXTS.NEGATIVE_SUBTITLE 
                    : TEXTS.RATING_SUBTITLE}
              </Text>

              {/* Stars Rating */}
              <View style={styles.starsContainer}>
                {renderStars()}
              </View>

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  { 
                    backgroundColor: selectedRating ? themeStyles.buttonBackground : themeStyles.borderColor,
                    opacity: selectedRating ? 1 : 0.7
                  }
                ]}
                onPress={handleSubmit}
                disabled={!selectedRating}
              >
                <Text style={styles.buttonText}>
                  {selectedRating && selectedRating === 5 
                    ? TEXTS.POSITIVE_BUTTON_PLAY_STORE 
                    : TEXTS.RATING_BUTTON}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RatingModal;