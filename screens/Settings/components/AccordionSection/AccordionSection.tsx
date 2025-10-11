// screens/Settings/components/AccordionSection/AccordionSection.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";

interface AccordionSectionProps {
  icon?: React.ReactNode;
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  icon,
  title,
  isExpanded,
  onToggle,
  children,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const animatedHeight = useSharedValue(isExpanded ? 1 : 0);

  // Update animation value when isExpanded changes
  React.useEffect(() => {
    animatedHeight.value = withTiming(isExpanded ? 1 : 0, {
      duration: 300,
    });
  }, [isExpanded]);

  // Chevron rotation animation
  const chevronStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      animatedHeight.value,
      [0, 1],
      [0, 180],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ rotate: `${rotate}deg` }],
    };
  });

  // Content opacity and scale animation
  const contentStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      animatedHeight.value,
      [0, 1],
      [0, 1],
      Extrapolate.CLAMP
    );
    return {
      opacity,
      display: animatedHeight.value === 0 ? "none" : "flex",
    };
  });

  const handleToggle = () => {
    triggerHaptic("light");
    onToggle();
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Header */}
      <TouchableOpacity
        style={styles.header}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            {title}
          </Text>
        </View>
        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={24} color={colors.textSecondary} />
        </Animated.View>
      </TouchableOpacity>

      {/* Content */}
      <Animated.View style={[contentStyle]}>
        <View style={[styles.content, { borderTopColor: colors.border }]}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    borderTopWidth: 1,
  },
});

export default AccordionSection;
