import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeInUp,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { Product } from "../utils/billing/BillingManager";
import styles from "./SubscriptionCard.styles";

interface SubscriptionCardProps {
  subscription: Product;
  index: number;
  onPress: (subscription: Product) => void;
  isBestValue?: boolean;
  disabled?: boolean;
}

const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
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
  const shinePosition = useSharedValue(-100);

  // Calculate savings (for yearly subscription display)
  const isYearly = subscription.productId.includes("yearly");

  // Setup animations
  useEffect(() => {
    // Animated shine for best value
    if (isBestValue) {
      // Periodic shine animation
      const animateShine = () => {
        shinePosition.value = -100;
        shinePosition.value = withDelay(
          1000 + Math.random() * 3000,
          withTiming(500, {
            duration: 1500,
            easing: Easing.out(Easing.ease),
          })
        );

        // Schedule next animation
        setTimeout(animateShine, 5000 + Math.random() * 2000);
      };

      animateShine();
    }
  }, [isBestValue]);

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
      withTiming(1, {
        duration: 150,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      })
    );
    opacity.value = withTiming(1, { duration: 150 });
  };

  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const shineAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: "25deg" }, { translateX: shinePosition.value }],
    };
  });

  return (
    <Animated.View
      entering={FadeInUp.delay(300 + index * 150).duration(500)}
      style={cardAnimatedStyle}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(subscription)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.container,
          {
            borderColor: theme.isDark
              ? "rgba(255,255,255,0.15)"
              : subscription.color + "40",
            backgroundColor: theme.isDark
              ? colors.card
              : disabled
              ? "rgba(0,0,0,0.03)"
              : "white",
          },
        ]}
      >
        {/* Animated shine effect for best value */}
        {isBestValue && (
          <Animated.View
            style={[
              styles.shine,
              shineAnimatedStyle,
              {
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.3)",
              },
            ]}
          />
        )}

        {/* Best value badge */}
        {isBestValue && (
          <View
            style={[
              styles.bestValueBadge,
              { backgroundColor: subscription.color },
            ]}
          >
            <Text style={styles.bestValueText}>{t('subscription.badge')}</Text>
          </View>
        )}

        <View style={styles.innerContainer}>
          <View style={styles.row}>
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                {
                  backgroundColor:
                    subscription.color + (theme.isDark ? "30" : "15"),
                },
              ]}
            >
              <Text style={styles.icon}>{subscription.icon}</Text>
            </View>

            {/* Content */}
            <View style={styles.contentContainer}>
              <Text
                style={[
                  styles.title,
                  {
                    color: disabled ? colors.textSecondary : colors.textPrimary,
                  },
                ]}
              >
                {subscription.title}
              </Text>

              <Text
                style={[
                  styles.description,
                  {
                    color: disabled
                      ? colors.textSecondary
                      : colors.textSecondary,
                  },
                ]}
                numberOfLines={2}
              >
                {subscription.description}
              </Text>

              {/* Benefits Badge - Subtle */}
              <View style={styles.benefitsBadge}>
                <Text style={[styles.benefitsText, { color: colors.textSecondary }]}>
                  🚀 {t('benefits.doubleEp')} + 🖼️ {t('benefits.imagePerMonth')} + 🛡️ {isYearly ? t('benefits.streakShieldsYearly') : t('benefits.streakShieldsMonthly')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Price bar */}
        <View
          style={[
            styles.priceBar,
            {
              backgroundColor: theme.isDark
                ? "rgba(255,255,255,0.1)"
                : subscription.color + "15",
            },
          ]}
        >
          <Text
            style={[
              styles.price,
              { color: theme.isDark ? "white" : subscription.color },
            ]}
          >
            {subscription.price}
          </Text>

          {isYearly && (
            <View
              style={[
                styles.savings,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.15)"
                    : subscription.color + "30",
                },
              ]}
            >
              <Text
                style={{ color: theme.isDark ? "white" : subscription.color }}
              >
                {t('subscription.savings', { percent: 17 })}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.subscribeButton,
              { backgroundColor: subscription.color },
            ]}
          >
            <Text style={styles.subscribeText}>{t('subscription.button')}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SubscriptionCard;
