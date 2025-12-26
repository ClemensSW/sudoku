// components/GameCompletion/components/PathCard/PathCard.tsx
import React, { useState, useCallback, useEffect } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import { useLevelInfo } from "../PlayerProgressionCard/utils/useLevelInfo";
import {
  GameStats,
  loadColorUnlock,
  updateSelectedColor,
  syncUnlockedColors,
  ColorUnlockData,
} from "@/utils/storage";

// Components
import PathTrail from "./components/PathTrail";
import MilestoneNotification from "./components/MilestoneNotification";
import ColorPickerModal from "./components/ColorPickerModal";

// Hooks
import { usePathAnimations } from "./hooks/usePathAnimations";
import { useMilestoneHandling } from "./hooks/useMilestoneHandling";
import { useProgressColor, useUpdateProgressColor, useRefreshProgressColor } from "@/hooks/useProgressColor";

// Styles
import styles from "./PathCard.styles";

// Milestone Levels
const MILESTONE_LEVELS = [5, 10, 15, 20];

interface PathCardProps {
  xp?: number;
  previousXp?: number;
  stats?: GameStats;
  justCompleted?: boolean;
  xpGain?: number;
}

const PathCard: React.FC<PathCardProps> = ({
  xp,
  previousXp,
  stats,
  justCompleted = false,
  xpGain,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const { t } = useTranslation('gameCompletion');

  // State
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorUnlockData, setColorUnlockData] = useState<ColorUnlockData | null>(null);

  // Calculate XP values
  const calculatedXp = stats ? stats.totalXP : 0;
  const currentXp = xp !== undefined ? xp : calculatedXp;
  const prevXp =
    previousXp !== undefined
      ? previousXp
      : justCompleted && (xpGain ?? 0) > 0
      ? currentXp - (xpGain ?? 0)
      : currentXp;

  // Level Info
  const levelInfo = useLevelInfo(currentXp);
  const previousLevelInfo = prevXp !== currentXp ? useLevelInfo(prevXp) : levelInfo;

  // Progress color from Context (reaktiv für alle Komponenten)
  const displayColor = useProgressColor();
  const updateColor = useUpdateProgressColor();
  const refreshColor = useRefreshProgressColor();

  // Animation Hooks
  const { cardAnimatedStyle, trailAnimatedStyle } = usePathAnimations({
    currentLevel: levelInfo.currentLevel,
    previousLevel: previousLevelInfo.currentLevel,
    pathColor: displayColor,
  });

  // Milestone Hook
  const {
    showMilestone,
    milestoneMessage,
    milestoneLevel,
    closeMilestone,
  } = useMilestoneHandling({
    levelInfo,
    stats,
    showMilestones: true,
    levelUpTriggered: false, // PathCard doesn't need to wait for level up
  });

  // Load color unlock data on mount and sync with level
  useEffect(() => {
    const loadColorData = async () => {
      const data = await loadColorUnlock();
      setColorUnlockData(data);

      // Sync unlocked colors with current level
      await syncUnlockedColors(levelInfo.currentLevel);

      // Refresh color context to reflect newly activated color
      await refreshColor();

      // Reload to get updated data after sync
      const updatedData = await loadColorUnlock();
      setColorUnlockData(updatedData);
    };

    loadColorData();
  }, [levelInfo.currentLevel, refreshColor]);

  const openColorPicker = useCallback(() => {
    setColorPickerVisible(true);
    triggerHaptic("light");
  }, []);

  const handleColorSelect = useCallback(async (color: string) => {
    await updateColor(color); // Verwendet Context-Funktion für reaktive Updates
    const updatedData = await loadColorUnlock();
    setColorUnlockData(updatedData);
    triggerHaptic("success");
  }, [updateColor]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          elevation: theme.isDark ? 0 : 4,
          shadowColor: theme.isDark ? "transparent" : displayColor,
        },
        cardAnimatedStyle,
      ]}
      entering={FadeIn.duration(350)}
    >
      {/* Header Section - minimalistisch */}
      <View style={styles.headerSection}>
        <Feather name="map" size={16} color={displayColor} />
        <Text style={[styles.headerLabel, { color: colors.textSecondary }]}>
          {t('path.title')}
        </Text>
      </View>

      {/* Trail Section - luftig */}
      <View
        style={[
          styles.trailSection,
          {
            borderBottomColor: theme.isDark
              ? "rgba(255,255,255,0.08)"
              : "rgba(0,0,0,0.06)",
          },
        ]}
      >
        <Animated.View style={trailAnimatedStyle}>
          <PathTrail
            color={displayColor}
            isDark={theme.isDark}
            currentLevel={levelInfo.currentLevel}
            previousLevel={previousLevelInfo.currentLevel}
            milestoneLevels={MILESTONE_LEVELS}
          />
        </Animated.View>
      </View>

      {/* Path Section - wie "Dein Titel" */}
      <View style={styles.pathSection}>
        <Pressable
          onPress={openColorPicker}
          style={({ pressed }) => [
            styles.pathPressable,
            {
              backgroundColor: pressed
                ? theme.isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.04)"
                : "transparent",
            },
          ]}
        >
          {/* Content Column (Label + Path Name) */}
          <View style={{ flex: 1 }}>
            {/* Header: Label + Icon */}
            <View style={styles.pathHeaderLeft}>
              <Feather name="compass" size={16} color={displayColor} />
              <Text style={[styles.pathLabel, { color: colors.textSecondary }]}>
                {t('path.currentPath')}
              </Text>
            </View>

            {/* Path Name */}
            <Text
              style={[styles.pathName, { color: colors.textPrimary }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {levelInfo.currentPath.name}
            </Text>
          </View>

          {/* Chevron - Center Aligned */}
          <Feather name="chevron-right" size={18} color={displayColor} style={{ alignSelf: 'center' }} />
        </Pressable>
      </View>

      {/* Milestone Notification */}
      {showMilestone && (
        <MilestoneNotification
          visible={showMilestone}
          message={milestoneMessage}
          milestoneLevel={milestoneLevel}
          color={displayColor}
          isDark={theme.isDark}
          onClose={closeMilestone}
          textPrimaryColor={colors.textPrimary}
          textSecondaryColor={colors.textSecondary}
        />
      )}

      {/* Color Picker Modal */}
      {colorUnlockData && (
        <ColorPickerModal
          visible={colorPickerVisible}
          onClose={() => setColorPickerVisible(false)}
          selectedColor={colorUnlockData.selectedColor}
          unlockedColors={colorUnlockData.unlockedColors}
          onSelectColor={handleColorSelect}
          currentLevel={levelInfo.currentLevel}
          isDark={theme.isDark}
          textPrimaryColor={colors.textPrimary}
          textSecondaryColor={colors.textSecondary}
          surfaceColor={colors.surface}
          borderColor={colors.border}
        />
      )}
    </Animated.View>
  );
};

export default React.memo(PathCard);
