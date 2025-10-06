import React, { useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  FadeIn,
  ZoomIn,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import {
  Landscape,
  LandscapeSegment,
} from "@/screens/Gallery/utils/landscapes/types";
import styles from "./GalleryProgressCard.styles";

export interface GalleryProgressCardProps {
  landscape: Landscape | null;
  newlyUnlockedSegmentId?: number;
  isComplete?: boolean;
  onViewGallery: () => void;
}

const GalleryProgressCard: React.FC<GalleryProgressCardProps> = ({
  landscape,
  newlyUnlockedSegmentId,
  isComplete = false,
  onViewGallery,
}) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const { colors } = theme;

  // Animation values
  const containerScale = useSharedValue(1);
  const segmentOpacities = useRef(
    Array(9)
      .fill(0)
      .map(() => useSharedValue(0))
  ).current;
  const segmentScales = useRef(
    Array(9)
      .fill(0)
      .map(() => useSharedValue(0.8))
  ).current;
  const progressWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  // If no landscape image is available, show a placeholder
  if (!landscape) {
    return (
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: theme.isDark ? "#1a1a1a" : "#ffffff",
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

  // Get progress color from first path (or default)
  const progressColor = colors.primary; // Could be dynamic based on landscape

  // Helper function to darken color
  const darkenColor = (color: string, amount: number): string => {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substring(0, 2), 16) - amount);
    const g = Math.max(0, parseInt(hex.substring(2, 4), 16) - amount);
    const b = Math.max(0, parseInt(hex.substring(4, 6), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Start animation effect
  useEffect(() => {
    // Container light scaling
    containerScale.value = withSequence(
      withTiming(1.02, { duration: 300 }),
      withTiming(1, { duration: 200 })
    );

    // Animate progress bar
    progressWidth.value = withTiming(progressPercentage, { duration: 1000 });

    // Animate segments
    landscape.segments.forEach((segment, index) => {
      if (segment.isUnlocked) {
        const delay = index * 50;

        // Opacity animation
        segmentOpacities[index].value = withDelay(
          delay,
          withTiming(1, { duration: 500 })
        );

        // Scale animation (bounce effect)
        segmentScales[index].value = withDelay(
          delay,
          withSpring(1, {
            damping: 10,
            stiffness: 80,
          })
        );
      } else {
        segmentOpacities[index].value = withTiming(0);
        segmentScales[index].value = withTiming(0.8);
      }
    });

    // Special animation for newly unlocked segment
    if (newlyUnlockedSegmentId !== undefined) {
      const segmentIndex = newlyUnlockedSegmentId;
      const delayAmount = 800;

      segmentOpacities[segmentIndex].value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(delayAmount, withTiming(1, { duration: 600 }))
      );

      segmentScales[segmentIndex].value = withSequence(
        withTiming(0.5, { duration: 0 }),
        withDelay(
          delayAmount,
          withSpring(1, {
            damping: 8,
            stiffness: 100,
          })
        )
      );
    }

    // Completion glow animation
    if (isComplete) {
      glowOpacity.value = withSequence(
        withDelay(1000, withTiming(1, { duration: 600 })),
        withTiming(0.5, { duration: 800 })
      );
    }
  }, [landscape, newlyUnlockedSegmentId, progressPercentage, isComplete]);

  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }],
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  // Render a single segment
  const renderSegment = (segment: LandscapeSegment, index: number) => {
    const isUnlocked = segment.isUnlocked;
    const isNewlyUnlocked = index === newlyUnlockedSegmentId;

    const segmentAnimatedStyle = useAnimatedStyle(() => ({
      opacity: segmentOpacities[index].value,
      transform: [{ scale: segmentScales[index].value }],
    }));

    return (
      <View key={`segment-${index}`} style={styles.segment}>
        {!isUnlocked ? (
          // Locked segment
          <View
            style={[
              styles.segmentInner,
              styles.lockedSegment,
              {
                backgroundColor: theme.isDark
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(255, 255, 255, 0.85)",
                borderColor: `${progressColor}30`,
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
        ) : (
          // Unlocked segment (transparent, shows image)
          <Animated.View
            style={[
              styles.segmentInner,
              styles.unlockedSegment,
              isNewlyUnlocked && {
                ...styles.newlyUnlockedSegment,
                borderColor: progressColor,
              },
              segmentAnimatedStyle,
            ]}
          />
        )}
      </View>
    );
  };

  // Calculate remaining segments
  const remainingSegments = 9 - landscape.progress;
  const isSpecialImage = landscape.progress === 8 || landscape.progress === 6 || landscape.progress === 3;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.isDark ? "#1a1a1a" : "#ffffff",
          elevation: theme.isDark ? 0 : 4,
          shadowColor: theme.isDark ? "transparent" : progressColor,
        },
        containerAnimatedStyle,
      ]}
      entering={FadeIn.duration(350)}
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
            {landscape.segments.map(renderSegment)}
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

      {/* Action Section */}
      <View style={styles.actionSection}>
        <Pressable
          onPress={onViewGallery}
          style={({ pressed }) => [
            styles.galleryButton,
            {
              backgroundColor: pressed
                ? darkenColor(progressColor, 20)
                : progressColor,
              shadowColor: progressColor,
            },
          ]}
        >
          <Feather name="image" size={18} color="#FFFFFF" />
          <Text style={styles.buttonText}>{t('buttons.viewGallery')}</Text>
          <Feather name="arrow-right" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default React.memo(GalleryProgressCard);
