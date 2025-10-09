import React, { useEffect, useRef } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  FadeInUp,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Product } from "../utils/billing/BillingManager";
import styles, { cardWidth } from "./SubscriptionCardSimple.styles";
import CalendarIcon from "@/assets/svg/calendar.svg";
import HeartIcon from "@/assets/svg/heart.svg";
import GiftIcon from "@/assets/svg/gift.svg";
import { LinearGradient } from 'expo-linear-gradient';

interface SubscriptionCardSimpleProps {
  subscription: Product;
  index: number;
  onPress: (subscription: Product) => void;
  isBestValue?: boolean;
  disabled?: boolean;
  isActive?: boolean;
  isFullWidth?: boolean;
}

const SubscriptionCardSimple: React.FC<SubscriptionCardSimpleProps> = ({
  subscription,
  index,
  onPress,
  isBestValue = false,
  disabled = false,
  isActive = false,
  isFullWidth = false,
}) => {
  const { t } = useTranslation('supportShop');
  const theme = useTheme();
  const { colors } = theme;

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const heartBeat = useSharedValue(1);

  const isYearly = subscription.productId.includes("yearly");
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Heart beat animation (nur für yearly)
  useEffect(() => {
    if (!isYearly) return;

    const heartBeatAnimation = () => {
      heartBeat.value = withSequence(
        withTiming(1.08, { duration: 220 }),
        withTiming(0.98, { duration: 160 }),
        withTiming(1.04, { duration: 160 }),
        withTiming(1, { duration: 240 })
      );
    };

    heartBeatAnimation();
    heartbeatIntervalRef.current = setInterval(heartBeatAnimation, 1500);

    return () => {
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
    };
  }, [isYearly, heartBeat]);

  // Handle press animation
  const handlePressIn = () => {
    scale.value = withTiming(0.98, {
      duration: 150,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    opacity.value = withTiming(0.9, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withTiming(1.02, {
        duration: 150,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      }),
      withTiming(1, { duration: 200 })
    );
    opacity.value = withTiming(1, { duration: 150 });
  };

  const handlePress = () => {
    if (!disabled) {
      onPress(subscription);
    }
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartBeat.value }],
  }));

  return (
    <Animated.View
      style={animatedStyle}
      entering={FadeInUp.delay(index * 100).duration(500)}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: isActive ? 'transparent' : (theme.isDark ? colors.card : "#FFFFFF"),
              borderColor: isActive ? "#D4AF37" : (isBestValue ? colors.primary : (theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")),
              borderWidth: isActive ? 2 : (isBestValue ? 2 : 1),
              overflow: 'hidden',
              width: isFullWidth ? '100%' : cardWidth,
            },
          ]}
        >
          {/* Gold Gradient Background for Active Subscription */}
          {isActive && (
            <LinearGradient
              colors={['#E5C158', '#D4AF37', '#C19A2E']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
            />
          )}

          {/* Active Badge */}
          {isActive && (
            <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
              <GiftIcon width={12} height={12} />
              <Text style={styles.badgeText}>{t('subscriptions.active')}</Text>
            </View>
          )}

          {/* Best Value Badge */}
          {!isActive && isBestValue && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Feather name="star" size={12} color="#FFFFFF" />
              <Text style={styles.badgeText}>{t('subscriptions.bestValue')}</Text>
            </View>
          )}

          {/* Icon Circle */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: subscription.color + (theme.isDark ? "30" : "15"),
              },
            ]}
          >
            {isYearly ? (
              <Animated.View style={heartAnimatedStyle}>
                <HeartIcon width={32} height={32} />
              </Animated.View>
            ) : (
              <CalendarIcon width={32} height={32} />
            )}
          </View>

          {/* Title */}
          <Text
            style={[
              styles.title,
              {
                color: isActive ? '#FFFFFF' : colors.textPrimary,
                textShadowColor: isActive ? 'rgba(0, 0, 0, 0.3)' : undefined,
                textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                textShadowRadius: isActive ? 2 : undefined,
              }
            ]}
            numberOfLines={1}
          >
            {subscription.title}
          </Text>

          {/* Benefits - Compact */}
          <View style={styles.benefitsRow}>
            <View style={styles.benefit}>
              <Feather name="zap" size={14} color={isActive ? '#FFFFFF' : colors.primary} />
              <Text style={[
                styles.benefitText,
                {
                  color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                  textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                  textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                  textShadowRadius: isActive ? 1 : undefined,
                }
              ]}>
                2× EP
              </Text>
            </View>
            <View style={styles.benefit}>
              <Feather name="image" size={14} color={isActive ? '#FFFFFF' : colors.primary} />
              <Text style={[
                styles.benefitText,
                {
                  color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                  textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                  textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                  textShadowRadius: isActive ? 1 : undefined,
                }
              ]}>
                {isYearly
                  ? t('benefits.imagePerYear', { count: 12 })
                  : t('benefits.imagePerMonth')
                }
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[
              styles.price,
              {
                color: isActive ? '#FFFFFF' : colors.textPrimary,
                textShadowColor: isActive ? 'rgba(0, 0, 0, 0.3)' : undefined,
                textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                textShadowRadius: isActive ? 2 : undefined,
              }
            ]}>
              {subscription.price.replace(/\/(Monat|Jahr|month|year|महीना|वर्ष)/, '')}
            </Text>
            <Text style={[
              styles.period,
              {
                color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                textShadowRadius: isActive ? 1 : undefined,
              }
            ]}>
              /{isYearly ? t('subscriptions.year') : t('subscriptions.month')}
            </Text>
          </View>

          {/* CTA Button */}
          <View style={[styles.button, { backgroundColor: isActive ? 'rgba(255, 255, 255, 0.25)' : colors.primary }]}>
            <Text style={styles.buttonText}>
              {isActive ? t('subscriptions.manage') : t('subscriptions.subscribe')}
            </Text>
            <Feather name={isActive ? 'settings' : 'arrow-right'} size={16} color="#FFFFFF" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SubscriptionCardSimple;
