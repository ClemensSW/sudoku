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
import { useTranslation } from "react-i18next";
import { Product } from "../utils/billing/BillingManager";
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
  const { t } = useTranslation('supportShop');
  const theme = useTheme();
  const { colors } = theme;

  // Animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const shinePosition = useSharedValue(-150);

  // Use random description if available
  const description =
    getRandomProductDescription(product.productId) || product.description;

  // Setup animations
  useEffect(() => {
    // Only animate shine for popular items
    if (isPopular) {
      // Periodic shine animation
      const animateShine = () => {
        shinePosition.value = -150;
        shinePosition.value = withDelay(
          2000 + Math.random() * 4000, // Random delay between animations
          withTiming(500, {
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

  // Professionelle Farben für Light Mode
  const getPriceContainerStyle = () => {
    if (theme.isDark) {
      return {
        backgroundColor: "rgba(255,255,255,0.15)",
      };
    } else {
      // Light Mode: Dezente, professionelle Farben
      switch (product.productId) {
        case 'sudoku_coffee':
          return { backgroundColor: "#FFF4E6" }; // Sehr helles Orange/Braun
        case 'sudoku_breakfast':
          return { backgroundColor: "#FFE8E8" }; // Sehr helles Rosa
        case 'sudoku_lunch':
          return { backgroundColor: "#E8F7F7" }; // Sehr helles Türkis
        case 'sudoku_feast':
          return { backgroundColor: "#F3E8FF" }; // Sehr helles Lila
        default:
          return { backgroundColor: "#F5F5F7" }; // Fallback: Apple-Style Grau
      }
    }
  };

  const getPriceTextColor = () => {
    if (theme.isDark) {
      return "white";
    } else {
      // Light Mode: Dunklere, lesbare Versionen der Produktfarben
      switch (product.productId) {
        case 'sudoku_coffee':
          return "#5D4037"; // Dunkles Braun
        case 'sudoku_breakfast':
          return "#C41E3A"; // Dunkles Rot
        case 'sudoku_lunch':
          return "#00695C"; // Dunkles Türkis
        case 'sudoku_feast':
          return "#5E35B1"; // Dunkles Lila
        default:
          return colors.textPrimary;
      }
    }
  };

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
              : "#E8EAED", // Professionelle graue Border im Light Mode
            backgroundColor: theme.isDark ? colors.card : "#FFFFFF",
          },
        ]}
      >
        {/* Animated shine effect for popular items */}
        {isPopular && (
          <Animated.View
            style={[
              styles.shine,
              shineAnimatedStyle
            ]}
          />
        )}

        <View style={styles.innerContainer}>
          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { 
                backgroundColor: theme.isDark 
                  ? product.color + "30" 
                  : getPriceContainerStyle().backgroundColor // Gleiche dezente Farbe wie Preisschild
              },
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
              getPriceContainerStyle(),
            ]}
          >
            <Text
              style={[
                styles.price,
                {
                  color: getPriceTextColor(),
                },
              ]}
            >
              {product.price}
            </Text>
          </View>
        </View>

        {/* Popular badge */}
        {isPopular && (
          <View style={[
            styles.popularBadge,
            {
              backgroundColor: theme.isDark ? "#FF6B6B" : "#EA4335", // Professionelleres Rot im Light Mode
            }
          ]}>
            <Text style={styles.popularText}>{t('product.badge')}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ProductCard;