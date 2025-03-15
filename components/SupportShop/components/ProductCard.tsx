import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeInRight,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Product } from "@/utils/billing/BillingManager";
import { getRandomProductDescription } from "../utils/supportMessages";
import styles from "./ProductCard.styles";

interface ProductCardProps {
  product: Product;
  index: number;
  onPress: (product: Product) => void;
  isPopular?: boolean;
  disabled?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onPress,
  isPopular = false,
  disabled = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shinePosition = useSharedValue(-100);

  // Use random description if available
  const description =
    getRandomProductDescription(product.productId) || product.description;

  // Setup animations
  useEffect(() => {
    // Only animate shine for popular items
    if (isPopular) {
      // Periodic shine animation
      const animateShine = () => {
        shinePosition.value = -100;
        shinePosition.value = withDelay(
          2000 + Math.random() * 4000, // Random delay between animations
          withTiming(400, {
            duration: 1000,
            easing: Easing.out(Easing.ease),
          })
        );

        // Schedule next animation
        setTimeout(animateShine, 6000 + Math.random() * 4000);
      };

      animateShine();
    }
  }, [isPopular]);

  // Handle press animation
  const handlePressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 150,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    opacity.value = withTiming(0.9, { duration: 150 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withTiming(1.03, {
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
      entering={FadeInRight.delay(200 + index * 100).duration(500)}
      style={cardAnimatedStyle}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPress(product)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        style={[
          styles.container,
          {
            borderColor: theme.isDark
              ? "rgba(255,255,255,0.15)"
              : product.color + "30",
            backgroundColor: theme.isDark ? colors.card : "#FFFFFF",
          },
        ]}
      >
        {/* Animated shine effect for popular items */}
        {isPopular && (
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

        <View style={styles.innerContainer}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: product.color + (theme.isDark ? "30" : "15") },
            ]}
          >
            <Text style={styles.icon}>{product.icon}</Text>
          </View>

          {/* Content */}
          <Text
            style={[
              styles.title,
              { color: disabled ? colors.textSecondary : colors.textPrimary },
            ]}
          >
            {product.title}
          </Text>

          <Text
            style={[
              styles.description,
              { color: disabled ? colors.textSecondary : colors.textSecondary },
            ]}
            numberOfLines={3}
          >
            {description}
          </Text>

          {/* Price */}
          <View
            style={[
              styles.priceContainer,
              {
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.15)"
                  : product.color + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.price,
                {
                  color: theme.isDark ? "white" : product.color,
                },
              ]}
            >
              {product.price}
            </Text>
          </View>
        </View>

        {/* Popular badge */}
        {isPopular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>Beliebt</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProductCard;
