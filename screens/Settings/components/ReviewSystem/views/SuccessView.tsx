// screens/Settings/components/ReviewSystem/views/SuccessView.tsx
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { styles, getThemeStyles } from '../styles';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';
import { useTranslation } from 'react-i18next';

// SVG Import
import SuccessSvg from '@/assets/svg/success.svg';

interface SuccessViewProps {
  onClose: () => void;
  queued?: boolean; // true if feedback was queued for later upload
}

const SuccessView: React.FC<SuccessViewProps> = ({ onClose, queued = false }) => {
  const { isDark, typography } = useTheme();
  const themeStyles = getThemeStyles(isDark);
  const { t } = useTranslation('feedback');

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(1)).current;

  // Entrance animation on mount
  useEffect(() => {
    // Trigger success haptic
    triggerHaptic('success');

    // Entrance animation
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Icon pulse animation
    const iconPulse = () => {
      Animated.sequence([
        Animated.timing(iconScale, {
          toValue: 1.15,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(iconScale, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    };

    // Start icon pulse after entrance
    const pulseTimer = setTimeout(iconPulse, 200);

    return () => clearTimeout(pulseTimer);
  }, [scaleAnim, fadeAnim, iconScale]);

  const handleClose = () => {
    triggerHaptic('light');
    onClose();
  };

  return (
    <Animated.View
      style={[
        styles.ratingViewContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Success Icon */}
      <Animated.View
        style={[
          styles.successIconWrapper,
          {
            transform: [{ scale: iconScale }],
          },
        ]}
      >
        <SuccessSvg width={120} height={120} />
      </Animated.View>

      {/* Title & Subtitle */}
      <View style={styles.textContainer}>
        <Text style={[styles.titleText, { color: themeStyles.text, fontSize: typography.size.xl }]}>
          {queued ? t('queued.title') : t('sent.title')}
        </Text>

        <Text style={[styles.subtitleText, { color: themeStyles.secondaryText, fontSize: typography.size.md }]}>
          {queued ? t('queued.subtitle') : t('sent.subtitle')}
        </Text>
      </View>

      {/* Close Button */}
      <View style={{ width: '100%', marginTop: 'auto' }}>
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              backgroundColor: '#FFCB2B',
            },
          ]}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.buttonText,
              {
                color: '#1A1A1A',
                fontSize: typography.size.md,
              },
            ]}
          >
            {queued ? t('queued.button') : t('sent.button')}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default SuccessView;
