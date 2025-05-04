// screens/SettingsScreen/components/ReviewSystem/RatingModal.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  Dimensions
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles, getThemeStyles, getEmojiBackgroundColor, getEmojiColor } from './styles';
import { Rating } from './types';
import { TEXTS, RATING_EMOJIS } from './constants';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';
import { FeatherIconName } from './feather-icons';

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  onRate: (rating: Rating) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;

const RatingModal: React.FC<RatingModalProps> = ({ visible, onClose, onRate }) => {
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [starAnimations] = useState(
    Array(5).fill(0).map(() => new Animated.Value(0))
  );
  
  const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
  const theme = useTheme();
  const themeStyles = getThemeStyles(theme.isDark);

  // PanResponder for dragging the bottom sheet
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // If dragged down more than 20% of the sheet, close it
        if (gestureState.dy > BOTTOM_SHEET_HEIGHT * 0.2) {
          Animated.timing(translateY, {
            toValue: BOTTOM_SHEET_HEIGHT,
            duration: 250,
            useNativeDriver: true
          }).start(onClose);
        } else {
          // Otherwise snap back to initial position
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4
          }).start();
        }
      }
    })
  ).current;

  // Emoji and texts based on the rating
  const getEmojiName = (): FeatherIconName => {
    if (!selectedRating) return 'star';
    
    if (selectedRating === 5) return RATING_EMOJIS.FIVE_STARS;
    if (selectedRating === 4) return RATING_EMOJIS.FOUR_STARS;
    if (selectedRating === 3) return RATING_EMOJIS.THREE_STARS;
    if (selectedRating === 2) return RATING_EMOJIS.TWO_STARS;
    return RATING_EMOJIS.ONE_STAR;
  };

  // Show/hide bottom sheet animation
  useEffect(() => {
    if (visible) {
      setSelectedRating(null);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 4
      }).start();

      // Animate stars
      starAnimations.forEach((anim, index) => {
        Animated.spring(anim, {
          toValue: 1,
          delay: 150 + index * 60,
          useNativeDriver: true,
          friction: 6
        }).start();
      });
    } else {
      translateY.setValue(BOTTOM_SHEET_HEIGHT);
      // Reset star animations
      starAnimations.forEach(anim => {
        anim.setValue(0);
      });
    }
  }, [visible, translateY, starAnimations]);

  // Handle star press
  const handleStarPress = (rating: Rating) => {
    triggerHaptic('light');
    setSelectedRating(rating);
  };

  // Submit rating
  const handleSubmit = () => {
    if (selectedRating) {
      triggerHaptic('medium');
      onRate(selectedRating);
    }
  };

  // Render stars
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
              { 
                rotate: starAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '0deg']
                })
              }
            ]
          }}
        >
          <TouchableOpacity
            style={styles.starButton}
            onPress={() => handleStarPress(rating)}
            activeOpacity={0.7}
          >
            <Feather
              name="star"
              size={40}
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
          <Animated.View
            style={[
              styles.modalContainer,
              { 
                backgroundColor: themeStyles.background,
                maxHeight: BOTTOM_SHEET_HEIGHT,
                transform: [{ translateY: translateY }]
              }
            ]}
          >
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

            {/* Title & Subtitle */}
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
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default RatingModal;