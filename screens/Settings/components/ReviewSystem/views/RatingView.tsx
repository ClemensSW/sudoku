// screens/Settings/components/ReviewSystem/views/RatingView.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { styles, getThemeStyles } from '../styles';
import { Rating } from '../types';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';
import { useTranslation } from 'react-i18next';

// SVG Imports
import StarSvg from '@/assets/svg/star.svg';
import StarEmptySvg from '@/assets/svg/starEmpty.svg';
import DeadSvg from '@/assets/svg/dead.svg';
import SadSvg from '@/assets/svg/sad.svg';
import NeutralSvg from '@/assets/svg/neutral.svg';
import ShySvg from '@/assets/svg/shy.svg';
import HeartSvg from '@/assets/svg/heart.svg';

interface RatingViewProps {
  onRate: (rating: Rating) => void;
}

const RatingView: React.FC<RatingViewProps> = ({ onRate }) => {
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [starAnimations] = useState(
    Array(5).fill(0).map(() => new Animated.Value(1))
  );

  const heartBeat = useRef(new Animated.Value(1)).current;
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const theme = useTheme();
  const themeStyles = getThemeStyles(theme.isDark);
  const { t } = useTranslation('feedback');

  // Get the appropriate icon component based on rating
  const getIconComponent = () => {
    if (!selectedRating) return StarSvg;

    if (selectedRating === 5) return HeartSvg;
    if (selectedRating === 4) return ShySvg;
    if (selectedRating === 3) return NeutralSvg;
    if (selectedRating === 2) return SadSvg;
    return DeadSvg;
  };

  // Heart beat animation
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
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      heartBeat.setValue(1);
    }
  }, [selectedRating, heartBeat]);

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
            transform: [{ scale: starAnimations[index] }]
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
    <View style={styles.ratingViewContainer}>
      {/* Icon */}
      <Animated.View style={[
        styles.iconWrapper,
        selectedRating === 5 && { transform: [{ scale: heartBeat }] }
      ]}>
        {(selectedRating === null || selectedRating === 5) ? (
          React.createElement(getIconComponent(), { width: 64, height: 64 })
        ) : (
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
            ? t('fiveStars.title')
            : selectedRating === 4
              ? t('fourStars.title')
              : selectedRating === 3
                ? t('threeStars.title')
                : selectedRating === 2
                  ? t('twoStars.title')
                  : selectedRating === 1
                    ? t('oneStar.title')
                    : t('rating.title')}
        </Text>

        <Text style={[styles.subtitleText, { color: themeStyles.secondaryText }]}>
          {selectedRating === 5
            ? t('fiveStars.subtitle')
            : selectedRating === 4
              ? t('fourStars.subtitle')
              : selectedRating === 3
                ? t('threeStars.subtitle')
                : selectedRating === 2
                  ? t('twoStars.subtitle')
                  : selectedRating === 1
                    ? t('oneStar.subtitle')
                    : t('rating.subtitle')}
        </Text>
      </View>

      {/* Stars Rating */}
      <View style={styles.starsContainer}>
        {renderStars()}
      </View>

      {/* Action Button */}
      <View style={{ width: '100%', marginTop: 'auto' }}>
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              backgroundColor: selectedRating ? '#FFCB2B' : themeStyles.borderColor,
            }
          ]}
          onPress={handleSubmit}
          disabled={!selectedRating}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.buttonText,
            {
              color: '#1A1A1A', // Always dark on yellow button
              opacity: selectedRating ? 1 : 0.5
            }
          ]}>
            {selectedRating && selectedRating === 5
              ? t('fiveStars.buttonPlayStore')
              : t('rating.button')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RatingView;
