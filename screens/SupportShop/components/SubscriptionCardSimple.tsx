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
import styles from "./SubscriptionCardSimple.styles";
import CalendarIcon from "@/assets/svg/calendar.svg";
import HeartIcon from "@/assets/svg/heart.svg";

interface SubscriptionCardSimpleProps {
  subscription: Product;
  index: number;
  onPress: (subscription: Product) => void;
  isBestValue?: boolean;
  disabled?: boolean;
}

const SubscriptionCardSimple: React.FC<SubscriptionCardSimpleProps> = ({
  subscription,
  index,
  onPress,
  isBestValue = false,
  disabled = false,
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
              backgroundColor: theme.isDark ? colors.card : "#FFFFFF",
              borderColor: isBestValue ? colors.primary : (theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"),
              borderWidth: isBestValue ? 2 : 1,
            },
          ]}
        >
          {/* Best Value Badge */}
          {isBestValue && (
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
            style={[styles.title, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {subscription.title}
          </Text>

          {/* Benefits - Compact */}
          <View style={styles.benefitsRow}>
            <View style={styles.benefit}>
              <Feather name="zap" size={14} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                2× EP
              </Text>
            </View>
            <View style={styles.benefit}>
              <Feather name="image" size={14} color={colors.primary} />
              <Text style={[styles.benefitText, { color: colors.textSecondary }]}>
                {isYearly ? "12" : "1"} {t('benefits.imagePerMonth')}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={[styles.price, { color: colors.textPrimary }]}>
              {subscription.price.replace(/\/(Monat|Jahr|month|year|महीना|वर्ष)/, '')}
            </Text>
            <Text style={[styles.period, { color: colors.textSecondary }]}>
              /{isYearly ? t('subscriptions.year') : t('subscriptions.month')}
            </Text>
          </View>

          {/* CTA Button */}
          <View style={[styles.button, { backgroundColor: colors.primary }]}>
            <Text style={styles.buttonText}>
              {t('subscriptions.subscribe')}
            </Text>
            <Feather name="arrow-right" size={16} color="#FFFFFF" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SubscriptionCardSimple;
