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
  FadeIn,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./ScrollIndicator.styles";

interface ScrollIndicatorProps {
  onPress: () => void;
  label?: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  onPress,
  label = "Mehr erfahren",
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const scrollHintOpacity = useSharedValue(1);

  // Start animations when component mounts
  useEffect(() => {
    // Scroll hint animation
    scrollHintOpacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      true
    );
  }, []);

  const scrollHintStyle = useAnimatedStyle(() => {
    return {
      opacity: scrollHintOpacity.value,
    };
  });

  return (
    <Animated.View
      style={[styles.scrollIndicator, scrollHintStyle]}
      entering={FadeIn.delay(1200).duration(600)}
    >
      <TouchableOpacity onPress={onPress} style={styles.scrollButton}>
        <Text style={[styles.scrollText, { color: colors.textSecondary }]}>
          {label}
        </Text>
        <Feather name="chevron-down" size={24} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ScrollIndicator;
