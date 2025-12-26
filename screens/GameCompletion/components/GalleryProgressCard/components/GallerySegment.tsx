import React, { useMemo } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LandscapeSegment } from "@/screens/Gallery/utils/landscapes/types";
import { radius } from "@/utils/theme";

interface GallerySegmentProps {
  segment: LandscapeSegment;
  index: number;
  isNewlyUnlocked: boolean;
  progressColor: string;
  isDark: boolean;
  surfaceColor: string;
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
}

// Corner radius für Eck-Segmente (passend zum Container)
const CORNER_RADIUS = radius.xl - 2; // Etwas kleiner wegen Padding
const INNER_RADIUS = 6; // Kleinerer Radius für innere Segmente

const GallerySegment: React.FC<GallerySegmentProps> = ({
  segment,
  index,
  isNewlyUnlocked,
  progressColor,
  isDark,
  surfaceColor,
  opacity,
  scale,
}) => {
  const segmentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Dynamische Border-Radien basierend auf Position im 3x3 Grid
  const cornerStyle = useMemo((): ViewStyle => {
    switch (index) {
      case 0: // Top-left
        return {
          borderTopLeftRadius: CORNER_RADIUS,
          borderTopRightRadius: INNER_RADIUS,
          borderBottomLeftRadius: INNER_RADIUS,
          borderBottomRightRadius: INNER_RADIUS,
        };
      case 2: // Top-right
        return {
          borderTopLeftRadius: INNER_RADIUS,
          borderTopRightRadius: CORNER_RADIUS,
          borderBottomLeftRadius: INNER_RADIUS,
          borderBottomRightRadius: INNER_RADIUS,
        };
      case 6: // Bottom-left
        return {
          borderTopLeftRadius: INNER_RADIUS,
          borderTopRightRadius: INNER_RADIUS,
          borderBottomLeftRadius: CORNER_RADIUS,
          borderBottomRightRadius: INNER_RADIUS,
        };
      case 8: // Bottom-right
        return {
          borderTopLeftRadius: INNER_RADIUS,
          borderTopRightRadius: INNER_RADIUS,
          borderBottomLeftRadius: INNER_RADIUS,
          borderBottomRightRadius: CORNER_RADIUS,
        };
      default: // Innere Segmente (1, 3, 4, 5, 7)
        return {
          borderRadius: INNER_RADIUS,
        };
    }
  }, [index]);

  return (
    <View key={`segment-${index}`} style={styles.segment}>
      {!segment.isUnlocked ? (
        // Locked segment
        <View
          style={[
            styles.segmentInner,
            styles.lockedSegment,
            cornerStyle,
            {
              backgroundColor: `${surfaceColor}fa`, // 98% opacity (fa in hex)
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(0, 0, 0, 0.1)",
            },
          ]}
        >
          <Feather
            name="lock"
            size={18}
            color={progressColor}
            style={{ opacity: 0.6 }}
          />
        </View>
      ) : isNewlyUnlocked ? (
        // Newly unlocked segment - Glasscheiben-Effekt
        <Animated.View
          style={[
            styles.segmentInner,
            styles.newlyUnlockedSegment,
            cornerStyle,
            {
              backgroundColor: `${progressColor}30`, // Glasscheiben-Effekt mit Path-Farbe
              borderColor: progressColor,
            },
            segmentAnimatedStyle,
          ]}
        />
      ) : (
        // Unlocked segment (transparent, shows image)
        <Animated.View
          style={[
            styles.segmentInner,
            styles.unlockedSegment,
            cornerStyle,
            segmentAnimatedStyle,
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  segment: {
    width: "33.33%",
    height: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    padding: 1, // Etwas mehr Padding für saubere Kanten
  },

  segmentInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    // borderRadius wird dynamisch via cornerStyle gesetzt
  },

  unlockedSegment: {
    // Transparent - shows image
  },

  lockedSegment: {
    borderWidth: 1.5,
  },

  newlyUnlockedSegment: {
    borderWidth: 2.5,
  },
});

export default React.memo(GallerySegment);
