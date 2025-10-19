import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useTranslation } from 'react-i18next';
import { useSupporter } from '@/modules/subscriptions/hooks/useSupporter';
import { getPathGradient } from '@/utils/pathColors';
import styles from './BenefitsBanner.styles';
import GiftIcon from '@/assets/svg/gift.svg';

// Versuche zunächst den LinearGradient zu importieren
let LinearGradient: any;
try {
  LinearGradient = require('expo-linear-gradient').LinearGradient;
} catch (error) {
  console.log('LinearGradient nicht verfügbar, verwende Fallback');
  LinearGradient = require('./GradientFallback').default;
}

interface BannerProps {
  primaryColor: string;
  secondaryColor: string; // Not used anymore, but kept for backward compatibility
}

interface BannerVariant {
  icon: keyof typeof Feather.glyphMap;
  titleKey: string;
  subtitleKey: string;
}

const BenefitsBanner: React.FC<BannerProps> = ({ primaryColor }) => {
  const theme = useTheme();
  const { t } = useTranslation('supportShop');
  const { isSupporter } = useSupporter();

  // Get dynamic gradient colors based on current path color and theme
  const gradientColors = getPathGradient(primaryColor, theme.isDark);

  // Animation values
  const scale = useSharedValue(1);
  const iconRotate = useSharedValue(0);
  const [currentVariantIndex, setCurrentVariantIndex] = useState(0);

  // Banner variants for non-supporters
  const benefitVariants: BannerVariant[] = [
    { icon: 'zap', titleKey: 'banner.variants.ep.title', subtitleKey: 'banner.variants.ep.subtitle' },
    { icon: 'image', titleKey: 'banner.variants.images.title', subtitleKey: 'banner.variants.images.subtitle' },
    { icon: 'shield', titleKey: 'banner.variants.shields.title', subtitleKey: 'banner.variants.shields.subtitle' },
    { icon: 'heart', titleKey: 'banner.variants.support.title', subtitleKey: 'banner.variants.support.subtitle' },
  ];

  // Supporter thank you variant
  const supporterVariant: BannerVariant = {
    icon: 'gift', // Will be replaced by SVG
    titleKey: 'banner.supporter.title',
    subtitleKey: 'banner.supporter.subtitle',
  };

  // Get current variant
  const currentVariant = isSupporter ? supporterVariant : benefitVariants[currentVariantIndex];

  // Rotate variants every 4 seconds (only for non-supporters)
  useEffect(() => {
    if (isSupporter) return;

    const interval = setInterval(() => {
      setCurrentVariantIndex((prev) => (prev + 1) % benefitVariants.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isSupporter]);

  // Start animations
  useEffect(() => {
    // Subtle pulsing animation for the icon
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Subtle rotation for the icon
    iconRotate.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-0.05, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  // Animated styles
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotate: `${iconRotate.value}rad` }
      ]
    };
  });

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(800)}
    >
      {/* Background with gradient - Premium Gold for Supporters, Dynamic Path Color Gradient otherwise */}
      <View style={styles.background}>
        <LinearGradient
          colors={isSupporter ? ['#C19A2E', '#D4AF37', '#E5C158'] : [...gradientColors].reverse()}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        />

        {/* Pattern overlay for texture */}
        <View style={styles.pattern} />

        {/* Premium shimmer effect for supporters */}
        {isSupporter && (
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            opacity: 0.5,
          }} />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Animated.Text
          key={`title-${currentVariant.titleKey}`}
          style={styles.title}
          entering={FadeIn.duration(400)}
          exiting={FadeOut.duration(400)}
        >
          {t(currentVariant.titleKey)}
        </Animated.Text>
        <Animated.Text
          key={`subtitle-${currentVariant.subtitleKey}`}
          style={styles.subtitle}
          entering={FadeIn.duration(400).delay(100)}
          exiting={FadeOut.duration(400)}
        >
          {t(currentVariant.subtitleKey)}
        </Animated.Text>
      </View>

      {/* Animated icon - Gift SVG for Supporters */}
      <Animated.View
        key={`icon-${currentVariant.icon}`}
        style={[styles.iconContainer, iconAnimatedStyle]}
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(400)}
      >
        {isSupporter ? (
          <GiftIcon width={36} height={36} />
        ) : (
          <Feather
            name={currentVariant.icon}
            size={32}
            color="#FFFFFF"
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};

export default BenefitsBanner;
