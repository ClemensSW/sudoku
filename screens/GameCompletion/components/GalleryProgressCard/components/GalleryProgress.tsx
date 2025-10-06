import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";
import { darkenColor } from "../utils/colorHelpers";
import { spacing } from "@/utils/theme";

interface GalleryProgressProps {
  landscape: Landscape;
  progressColor: string;
  progressAnimatedStyle: any;
}

const GalleryProgress: React.FC<GalleryProgressProps> = ({
  landscape,
  progressColor,
  progressAnimatedStyle,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const { colors } = theme;

  const remainingSegments = 9 - landscape.progress;
  const isSpecialImage = landscape.progress === 8 || landscape.progress === 6 || landscape.progress === 3;

  return (
    <View
      style={[
        styles.progressSection,
        {
          borderBottomColor: theme.isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.06)",
        },
      ]}
    >
      <Text style={[styles.progressText, { color: colors.textSecondary }]}>
        {landscape.isComplete
          ? t('gallery.fullyUnlocked')
          : isSpecialImage
          ? t('gallery.solveMore', {
              count: remainingSegments,
              plural: remainingSegments === 1 ? 's' : '',
              plural2: remainingSegments === 1 ? '' : 's',
            })
          : t('gallery.segmentsUnlocked', { count: landscape.progress })}
      </Text>

      {/* Progress Bar with Gradient */}
      <View
        style={[
          styles.progressBarContainer,
          {
            backgroundColor: theme.isDark
              ? "rgba(255,255,255,0.10)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        <Animated.View
          style={[
            {
              position: "absolute",
              height: "100%",
              left: 0,
              borderRadius: 8,
              overflow: "hidden",
            },
            progressAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={[progressColor, darkenColor(progressColor, 40)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.progressFill}
          />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },

  progressText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: spacing.md,
  },

  progressBarContainer: {
    width: "100%",
    height: 16,
    borderRadius: 8,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
  },
});

export default React.memo(GalleryProgress);
