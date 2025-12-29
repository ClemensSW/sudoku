// screens/DuoScreen/components/ScrollIndicator/ScrollIndicator.tsx
import React, { useEffect } from "react";
import { Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import styles from "./ScrollIndicator.styles";

interface ScrollIndicatorProps {
  onPress: () => void;
  label?: string;
  noAnimation?: boolean;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  onPress,
  label,
  noAnimation = false
}) => {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('duo');
  const scrollHintOpacity = useSharedValue(1);

  // Start animations when component mounts
  useEffect(() => {
    // Only run animation if noAnimation is false
    if (!noAnimation) {
      // Scroll hint animation
      scrollHintOpacity.value = withRepeat(
        withSequence(
          withTiming(0.5, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    }
  }, [noAnimation]);

  const scrollHintStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHintOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[styles.scrollIndicator, scrollHintStyle]}
    >
      <TouchableOpacity onPress={onPress} style={styles.scrollButton}>
        <Text style={[styles.scrollText, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
          {label || t('scrollIndicator.label')}
        </Text>
        <Feather name="chevron-down" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ScrollIndicator;