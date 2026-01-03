import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { useEffect } from "react";

interface ComingSoonOverlayProps {
  /** Text to display (default: "BALD VERFÜGBAR") */
  text?: string;
  /** Icon name from Feather (default: "clock") */
  icon?: keyof typeof Feather.glyphMap;
  /** Border radius to match parent container */
  borderRadius?: number;
}

export const ComingSoonOverlay: React.FC<ComingSoonOverlayProps> = ({
  text = "BALD VERFÜGBAR",
  icon = "clock",
  borderRadius = 16,
}) => {
  const theme = useTheme();
  const pulseOpacity = useSharedValue(1);

  useEffect(() => {
    // Subtle pulse animation for the badge
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.85, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    opacity: pulseOpacity.value,
  }));

  const badgeBackgroundColor = theme.isDark
    ? "rgba(60, 130, 145, 0.95)"
    : "rgba(46, 107, 123, 0.95)";

  return (
    <View style={[styles.container, { borderRadius }]} pointerEvents="box-only">
      <BlurView
        intensity={Platform.OS === "ios" ? 25 : 100}
        tint={theme.isDark ? "dark" : "light"}
        style={[styles.blurView, { borderRadius }]}
      >
        <Animated.View
          style={[
            styles.badge,
            { backgroundColor: badgeBackgroundColor },
            badgeAnimatedStyle,
          ]}
        >
          <Feather name={icon} size={18} color="#FFFFFF" style={styles.icon} />
          <Text style={styles.text}>{text}</Text>
        </Animated.View>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 10,
  },
  blurView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
});

export default ComingSoonOverlay;
