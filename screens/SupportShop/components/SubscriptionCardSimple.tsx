import React from "react";
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
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Product } from "../utils/billing/BillingManager";
import styles from "./SubscriptionCardSimple.styles";

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

  const isYearly = subscription.productId.includes("yearly");

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
              <Text style={styles.badgeText}>Best Value</Text>
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
            <Text style={styles.icon}>{subscription.icon}</Text>
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
              {subscription.price}
            </Text>
            <Text style={[styles.period, { color: colors.textSecondary }]}>
              {isYearly ? "/Jahr" : "/Monat"}
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
