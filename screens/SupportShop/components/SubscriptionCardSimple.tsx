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
import { useProgressColor } from "@/hooks/useProgressColor";
import { Product } from "../utils/billing/BillingManager";
import Button from "@/components/Button/Button";
import styles, { cardWidth, fullCardWidth } from "./SubscriptionCardSimple.styles";
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
  const { colors, typography } = theme;
  const progressColor = useProgressColor(); // Dynamic path color

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
              borderColor: isActive ? "#D4AF37" : (isBestValue ? progressColor : (theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")),
              borderWidth: isActive ? 2 : (isBestValue ? 2 : 1),
              overflow: 'hidden',
              width: isFullWidth ? fullCardWidth : cardWidth,
              padding: isFullWidth ? 20 : 16,
              marginBottom: isFullWidth ? 0 : 12,
            },
          ]}
        >
          {/* Gold Gradient Background for Active Subscription - Top Left Light to Bottom Right Dark */}
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

          {isFullWidth ? (
            // Professional Horizontal Layout for Full Width Active Card
            <>
              {/* Active Badge - Top Right */}
              {isActive && (
                <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                  <GiftIcon width={12} height={12} />
                  <Text style={styles.badgeText}>{t('subscriptions.active')}</Text>
                </View>
              )}

              {/* Subtle Settings Button - Bottom Right */}
              {isActive && (
                <TouchableOpacity
                  onPress={() => onPress(subscription)}
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 12,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                  }}
                  activeOpacity={0.7}
                >
                  <Feather name="settings" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24, paddingVertical: 4 }}>
                {/* Left: Large Prominent Icon */}
                <View
                  style={[
                    styles.iconCircle,
                    {
                      backgroundColor: subscription.color + (theme.isDark ? "30" : "15"),
                      marginBottom: 0,
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                    },
                  ]}
                >
                  {isYearly ? (
                    <Animated.View style={heartAnimatedStyle}>
                      <HeartIcon width={40} height={40} />
                    </Animated.View>
                  ) : (
                    <CalendarIcon width={40} height={40} />
                  )}
                </View>

                {/* Center: Title & Benefits (Vertical) - Now with more space */}
                <View style={{ flex: 1, paddingRight: 40 }}>
                  <Text
                    style={[
                      styles.title,
                      {
                        color: isActive ? '#FFFFFF' : colors.textPrimary,
                        textShadowColor: isActive ? 'rgba(0, 0, 0, 0.3)' : undefined,
                        textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                        textShadowRadius: isActive ? 2 : undefined,
                        fontSize: typography.size.lg,
                        fontWeight: '700',
                        marginBottom: 10,
                      }
                    ]}
                    numberOfLines={2}
                  >
                    {subscription.title}
                  </Text>

                  <View style={{ flexDirection: 'column', gap: 6 }}>
                    <View style={styles.benefit}>
                      <Feather name="zap" size={16} color={isActive ? '#FFFFFF' : progressColor} />
                      <Text style={[
                        styles.benefitText,
                        {
                          color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                          textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                          textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                          textShadowRadius: isActive ? 1 : undefined,
                          fontSize: typography.size.sm,
                          fontWeight: '600',
                        }
                      ]}>
                        2× EP
                      </Text>
                    </View>
                    <View style={styles.benefit}>
                      <Feather name="image" size={16} color={isActive ? '#FFFFFF' : progressColor} />
                      <Text style={[
                        styles.benefitText,
                        {
                          color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                          textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                          textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                          textShadowRadius: isActive ? 1 : undefined,
                          fontSize: typography.size.sm,
                          fontWeight: '600',
                        }
                      ]}>
                        {isYearly
                          ? t('benefits.imagePerYearly')
                          : t('benefits.imagePerMonthly')
                        }
                      </Text>
                    </View>
                    <View style={styles.benefit}>
                      <Feather name="shield" size={16} color={isActive ? '#FFFFFF' : progressColor} />
                      <Text style={[
                        styles.benefitText,
                        {
                          color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                          textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                          textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                          textShadowRadius: isActive ? 1 : undefined,
                          fontSize: typography.size.sm,
                          fontWeight: '600',
                        }
                      ]}>
                        {isYearly ? t('benefits.streakShieldsYearly') : t('benefits.streakShieldsMonthly')}
                      </Text>
                    </View>
                    <View style={styles.benefit}>
                      <Feather name="eye-off" size={16} color={isActive ? '#FFFFFF' : progressColor} />
                      <Text style={[
                        styles.benefitText,
                        {
                          color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                          textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                          textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                          textShadowRadius: isActive ? 1 : undefined,
                          fontSize: typography.size.sm,
                          fontWeight: '600',
                        }
                      ]}>
                        {t('benefits.adFree')}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </>
          ) : (
            // Vertical Layout for Normal Width
            <>
              {/* Active Badge */}
              {isActive && (
                <View style={[styles.badge, { backgroundColor: 'rgba(255, 255, 255, 0.25)' }]}>
                  <GiftIcon width={12} height={12} />
                  <Text style={styles.badgeText}>{t('subscriptions.active')}</Text>
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
                  <Feather name="zap" size={14} color={isActive ? '#FFFFFF' : progressColor} />
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
                  <Feather name="image" size={14} color={isActive ? '#FFFFFF' : progressColor} />
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
                      ? t('benefits.imagePerYearly')
                      : t('benefits.imagePerMonthly')
                    }
                  </Text>
                </View>
                <View style={styles.benefit}>
                  <Feather name="shield" size={14} color={isActive ? '#FFFFFF' : progressColor} />
                  <Text style={[
                    styles.benefitText,
                    {
                      color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                      textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                      textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                      textShadowRadius: isActive ? 1 : undefined,
                    }
                  ]}>
                    {isYearly ? t('benefits.streakShieldsYearly') : t('benefits.streakShieldsMonthly')}
                  </Text>
                </View>
                <View style={styles.benefit}>
                  <Feather name="eye-off" size={14} color={isActive ? '#FFFFFF' : progressColor} />
                  <Text style={[
                    styles.benefitText,
                    {
                      color: isActive ? 'rgba(255, 255, 255, 0.95)' : colors.textSecondary,
                      textShadowColor: isActive ? 'rgba(0, 0, 0, 0.2)' : undefined,
                      textShadowOffset: isActive ? { width: 0, height: 1 } : undefined,
                      textShadowRadius: isActive ? 1 : undefined,
                    }
                  ]}>
                    {t('benefits.adFree')}
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
              <Button
                title={isActive ? t('subscriptions.manage') : t('subscriptions.subscribe')}
                onPress={handlePress}
                variant="primary"
                customColor={isActive ? 'rgba(255, 255, 255, 0.25)' : progressColor}
                iconRight={isActive ? <Feather name="settings" size={16} /> : undefined}
                disabled={disabled}
                style={{
                  paddingVertical: 12,
                  borderRadius: 12,
                  shadowOpacity: 0,
                  elevation: 0,
                }}
                textStyle={{
                  fontSize: typography.size.sm,
                  fontWeight: '700',
                }}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default SubscriptionCardSimple;
