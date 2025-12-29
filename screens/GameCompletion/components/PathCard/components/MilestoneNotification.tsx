// components/GameCompletionModal/components/PlayerProgressionCard/components/MilestoneNotification.tsx
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  SlideInUp,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface MilestoneNotificationProps {
  visible: boolean;
  message: string;
  milestoneLevel: number;
  color: string;
  isDark: boolean;
  onClose: () => void;
  textPrimaryColor: string;
  textSecondaryColor: string;
}

const MilestoneNotification: React.FC<MilestoneNotificationProps> = ({
  visible,
  message,
  milestoneLevel,
  color,
  isDark,
  onClose,
  textPrimaryColor,
  textSecondaryColor,
}) => {
  const theme = useTheme();
  const { typography } = theme;
  const scale = useSharedValue(0.95);

  React.useEffect(() => {
    if (visible) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 300 }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [visible, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleClose = () => {
    scale.value = withTiming(0.9, {
      duration: 200,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    setTimeout(() => onClose(), 200);
  };

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: isDark ? `${color}20` : `${color}10`,
          borderColor: color,
        },
        animatedStyle,
      ]}
      entering={SlideInUp.duration(300).springify()}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Feather name="award" size={18} color={color} style={{ marginRight: 8 }} />
          <Text style={[styles.title, { color: textPrimaryColor, fontSize: typography.size.md }]}>
            Meilenstein erreicht!
          </Text>
        </View>

        <Pressable
          onPress={handleClose}
          style={({ pressed }) => [
            styles.closeButton,
            {
              backgroundColor: pressed
                ? isDark
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(0,0,0,0.06)"
                : "transparent",
            },
          ]}
        >
          <Feather name="x" size={18} color={textSecondaryColor} />
        </Pressable>
      </View>

      <Text style={[styles.message, { color: textSecondaryColor, fontSize: typography.size.sm }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeButton: {
    padding: 8,
    borderRadius: 12,
  },
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: "900",
  },
  message: {
    // fontSize set dynamically via theme.typography
    lineHeight: 22,
  },
});

export default MilestoneNotification;
