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
import { SvgXml } from 'react-native-svg';
import i18next from 'i18next';

// SVG Imports
import StarSvg from '@/assets/svg/star.svg';
import StarEmptySvg from '@/assets/svg/starEmpty.svg';
import DeadSvg from '@/assets/svg/dead.svg';
import SadSvg from '@/assets/svg/sad.svg';
import NeutralSvg from '@/assets/svg/neutral.svg';
import ShySvg from '@/assets/svg/shy.svg';
import HeartSvg from '@/assets/svg/heart.svg';

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
  const heartBeat = useRef(new Animated.Value(1)).current;
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

  // Get the appropriate icon component based on rating
  const getIconComponent = () => {
    if (!selectedRating) return StarSvg;

    if (selectedRating === 5) return HeartSvg;
    if (selectedRating === 4) return ShySvg;
    if (selectedRating === 3) return NeutralSvg;
    if (selectedRating === 2) return SadSvg;
    return DeadSvg;
  };

  // Heart beat animation (same as Support Banner)
  useEffect(() => {
    if (selectedRating === 5) {
      const heartBeatAnimation = () => {
        Animated.sequence([
          Animated.timing(heartBeat, {
            toValue: 1.08,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(heartBeat, {
            toValue: 0.98,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(heartBeat, {
            toValue: 1.04,
            duration: 160,
            useNativeDriver: true,
          }),
          Animated.timing(heartBeat, {
            toValue: 1,
            duration: 240,
            useNativeDriver: true,
          }),
        ]).start();
      };

      heartBeatAnimation();
      heartbeatIntervalRef.current = setInterval(heartBeatAnimation, 1500);

      return () => {
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
          heartbeatIntervalRef.current = null;
        }
      };
    } else {
      // Stop animation and reset
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      heartBeat.setValue(1);
    }
  }, [selectedRating, heartBeat]);

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
      // Clean up heart animation
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      heartBeat.setValue(1);
    }
  }, [visible, translateY, starAnimations, heartBeat]);

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
      const StarComponent = isFilled ? StarSvg : StarEmptySvg;
      const starColor = theme.isDark ? themeStyles.borderColor : '#BCBCBC';

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
            <View style={{ opacity: isFilled ? 1 : 0.8 }}>
              {isFilled ? (
                <StarComponent width={40} height={40} />
              ) : (
                <StarComponent width={40} height={40} color={starColor} />
              )}
            </View>
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

            {/* Icon */}
            <Animated.View style={[
              styles.iconWrapper,
              selectedRating === 5 && { transform: [{ scale: heartBeat }] }
            ]}>
              {(selectedRating === null || selectedRating === 5) ? (
                // Stern und Herz: Ohne Schatten und ohne Kreis
                React.createElement(getIconComponent(), { width: 64, height: 64 })
              ) : (
                // Andere Icons: Kleiner Kreis im Hintergrund
                <>
                  <View style={[styles.emojiCircle, { backgroundColor: themeStyles.background }]} />
                  <View style={styles.iconAbsolute}>
                    {React.createElement(getIconComponent(), { width: 64, height: 64 })}
                  </View>
                </>
              )}
            </Animated.View>

            {/* Title & Subtitle */}
            <View style={styles.textContainer}>
              <Text style={[styles.titleText, { color: themeStyles.text }]}>
                {selectedRating === 5
                  ? i18next.t('feedback:fiveStars.title')
                  : selectedRating === 4
                    ? i18next.t('feedback:fourStars.title')
                    : selectedRating === 3
                      ? i18next.t('feedback:threeStars.title')
                      : selectedRating === 2
                        ? i18next.t('feedback:twoStars.title')
                        : selectedRating === 1
                          ? i18next.t('feedback:oneStar.title')
                          : TEXTS.RATING_TITLE}
              </Text>

              <Text style={[styles.subtitleText, { color: themeStyles.secondaryText }]}>
                {selectedRating === 5
                  ? i18next.t('feedback:fiveStars.subtitle')
                  : selectedRating === 4
                    ? i18next.t('feedback:fourStars.subtitle')
                    : selectedRating === 3
                      ? i18next.t('feedback:threeStars.subtitle')
                      : selectedRating === 2
                        ? i18next.t('feedback:twoStars.subtitle')
                        : selectedRating === 1
                          ? i18next.t('feedback:oneStar.subtitle')
                          : TEXTS.RATING_SUBTITLE}
              </Text>
            </View>

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
                  ? i18next.t('feedback:fiveStars.buttonPlayStore')
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