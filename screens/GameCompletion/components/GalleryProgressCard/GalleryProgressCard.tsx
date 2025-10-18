import React, { useState } from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { GameStats } from "@/utils/storage";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";

// Components
import GallerySegment from "./components/GallerySegment";
import GalleryInfo from "./components/GalleryInfo";
import GalleryAction from "./components/GalleryAction";

// Hooks
import { useGalleryAnimations } from "./hooks/useGalleryAnimations";
import { useProgressColor } from "@/hooks/useProgressColor";

// Styles
import styles from "./GalleryProgressCard.styles";

export interface GalleryProgressCardProps {
  landscape: Landscape | null;
  newlyUnlockedSegmentId?: number;
  isComplete?: boolean;
  onViewGallery: () => void;
  stats?: GameStats;
  buttonVariant?: 'primary' | 'outline'; // primary = filled, outline = less prominent
}

const GalleryProgressCard: React.FC<GalleryProgressCardProps> = ({
  landscape,
  newlyUnlockedSegmentId,
  isComplete = false,
  onViewGallery,
  stats,
  buttonVariant = 'primary',
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const { colors } = theme;

  // Get custom progress color
  const calculatedXp = stats ? stats.totalXP : 0;
  const progressColor = useProgressColor(calculatedXp);

  // Track visibility for animation
  const [isVisible, setIsVisible] = useState(false);

  // If no landscape image is available, show a placeholder
  if (!landscape) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            elevation: theme.isDark ? 0 : 4,
          },
        ]}
        entering={FadeIn.duration(500)}
      >
        <View style={styles.headerSection}>
          <Feather name="image" size={16} color={colors.textSecondary} />
          <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>
            {t('gallery.loading')}
          </Text>
        </View>
      </Animated.View>
    );
  }

  // Animation hook
  const {
    containerAnimatedStyle,
    glowAnimatedStyle,
    segmentOpacities,
    segmentScales,
  } = useGalleryAnimations({
    landscape,
    newlyUnlockedSegmentId,
    isComplete,
    isVisible,
  });

  // Handler for when card becomes visible
  const handleLayout = () => {
    if (!isVisible) {
      setIsVisible(true);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 4,
          shadowColor: theme.isDark ? "transparent" : progressColor,
        },
        containerAnimatedStyle,
      ]}
      entering={FadeIn.duration(350)}
      onLayout={handleLayout}
    >
      {/* Header Section - minimalistisch */}
      <View style={styles.headerSection}>
        <Feather name="image" size={16} color={progressColor} />
        <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>
          {t('gallery.title')}
        </Text>
      </View>

      {/* Puzzle Section - luftig */}
      <View
        style={[
          styles.puzzleSection,
          {
            borderBottomColor: theme.isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        <View style={styles.puzzleContainer}>
          <Animated.Image
            source={landscape.previewSource}
            style={styles.puzzleImage}
          />

          {/* Grid Overlay with segments */}
          <View style={styles.gridOverlay}>
            {landscape.segments.map((segment, index) => (
              <GallerySegment
                key={`segment-${index}`}
                segment={segment}
                index={index}
                isNewlyUnlocked={index === newlyUnlockedSegmentId}
                progressColor={progressColor}
                isDark={theme.isDark}
                surfaceColor={colors.surface}
                opacity={segmentOpacities[index]}
                scale={segmentScales[index]}
              />
            ))}
          </View>

          {/* Completion Glow */}
          {isComplete && (
            <Animated.View
              style={[
                styles.completionGlow,
                {
                  borderColor: progressColor,
                },
                glowAnimatedStyle,
              ]}
            />
          )}

          {/* Celebration Overlay */}
          {isComplete && (
            <Animated.View
              style={[
                styles.celebrationOverlay,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(0, 0, 0, 0.3)"
                    : "rgba(0, 0, 0, 0.2)",
                },
              ]}
              entering={FadeIn.duration(500).delay(800)}
            >
              <Text style={styles.completionText}>
                {t('gallery.imageComplete')}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Info Section - Bildname + Motivationstext */}
      <GalleryInfo landscape={landscape} />

      {/* Action Section */}
      <GalleryAction
        progressColor={progressColor}
        onPress={onViewGallery}
        variant={buttonVariant}
      />
    </Animated.View>
  );
};

export default React.memo(GalleryProgressCard);
