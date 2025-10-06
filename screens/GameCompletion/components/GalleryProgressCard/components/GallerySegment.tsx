import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, SharedValue } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LandscapeSegment } from "@/screens/Gallery/utils/landscapes/types";

interface GallerySegmentProps {
  segment: LandscapeSegment;
  index: number;
  isNewlyUnlocked: boolean;
  progressColor: string;
  isDark: boolean;
  opacity: SharedValue<number>;
  scale: SharedValue<number>;
}

const GallerySegment: React.FC<GallerySegmentProps> = ({
  segment,
  index,
  isNewlyUnlocked,
  progressColor,
  isDark,
  opacity,
  scale,
}) => {
  const segmentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View key={`segment-${index}`} style={styles.segment}>
      {!segment.isUnlocked ? (
        // Locked segment
        <View
          style={[
            styles.segmentInner,
            styles.lockedSegment,
            {
              backgroundColor: isDark
                ? "rgba(26, 26, 26, 0.98)"
                : "rgba(245, 245, 245, 0.98)",
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
    padding: 0.5,
  },

  segmentInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
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
