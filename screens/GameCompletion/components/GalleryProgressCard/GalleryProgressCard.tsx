import React, { useState } from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useLevelInfo } from "../PlayerProgressionCard/utils/useLevelInfo";
import { GameStats } from "@/utils/storage";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";

// Components
import GallerySegment from "./components/GallerySegment";
import GalleryProgress from "./components/GalleryProgress";
import GalleryAction from "./components/GalleryAction";

// Hooks
import { useGalleryAnimations } from "./hooks/useGalleryAnimations";

// Styles
import styles from "./GalleryProgressCard.styles";

export interface GalleryProgressCardProps {
  landscape: Landscape | null;
  newlyUnlockedSegmentId?: number;
  isComplete?: boolean;
  onViewGallery: () => void;
  stats?: GameStats;
}

const GalleryProgressCard: React.FC<GalleryProgressCardProps> = ({
  landscape,
  newlyUnlockedSegmentId,
  isComplete = false,
  onViewGallery,
  stats,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const { colors } = theme;

  // Get level info for path color
  const calculatedXp = stats ? stats.totalXP : 0;
  const levelInfo = useLevelInfo(calculatedXp);

  // Track visibility for animation
  const [isVisible, setIsVisible] = useState(false);

  // If no landscape image is available, show a placeholder
  if (!landscape) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: theme.isDark ? "#2a2a2a" : "#ffffff",
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

  // Calculate progress percentage
  const progressPercentage = (landscape.progress / 9) * 100;

  // Get progress color from level info (path color)
  const progressColor = levelInfo.currentPath.color;

  // Animation hook
  const {
    containerAnimatedStyle,
    progressAnimatedStyle,
    glowAnimatedStyle,
    segmentOpacities,
    segmentScales,
  } = useGalleryAnimations({
    landscape,
    newlyUnlockedSegmentId,
    isComplete,
    isVisible,
    progressPercentage,
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
          backgroundColor: theme.isDark ? "#2a2a2a" : "#ffffff",
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

        {/* Badge (optional) */}
        {newlyUnlockedSegmentId !== undefined && (
          <Animated.View
            style={[
              styles.badge,
              { backgroundColor: progressColor },
            ]}
            entering={ZoomIn.duration(300).delay(300)}
          >
            <Feather name="plus" size={12} color="#FFFFFF" />
            <Text style={styles.badgeText}>{t('gallery.newSegment')}</Text>
          </Animated.View>
        )}

        {isComplete && (
          <Animated.View
            style={[
              styles.badge,
              { backgroundColor: colors.success },
            ]}
            entering={ZoomIn.duration(300).delay(300)}
          >
            <Feather name="check" size={12} color="#FFFFFF" />
            <Text style={styles.badgeText}>{t('gallery.complete')}</Text>
          </Animated.View>
        )}
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

      {/* Progress Section */}
      <GalleryProgress
        landscape={landscape}
        progressColor={progressColor}
        progressAnimatedStyle={progressAnimatedStyle}
      />

      {/* Action Section */}
      <GalleryAction
        progressColor={progressColor}
        onPress={onViewGallery}
      />
    </Animated.View>
  );
};

export default React.memo(GalleryProgressCard);
