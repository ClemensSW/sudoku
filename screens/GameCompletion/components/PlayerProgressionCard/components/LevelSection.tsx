// components/GameCompletionModal/components/PlayerProgressionCard/components/LevelSection.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import LevelBadge from "./LevelBadge";
import TitleSelect from "./TitleSelect";
import { LevelInfo } from "../utils/types";
import styles from "../PlayerProgressionCard.styles";
import { getLevels } from "../utils/levelData";

type LevelSectionProps = {
  levelInfo: LevelInfo;
  xpGain?: number;
  justCompleted: boolean;
  compact: boolean;
  progressColor: string;
  badgeAnimatedStyle: any;
  xpGainAnimatedStyle: any;
  progressAnimatedStyle: any;
  previousProgressAnimatedStyle: any;
  gainIndicatorAnimatedStyle: any;
  hasLevelChanged: boolean;
  showLevelUpOverlay: boolean;
  previousProgressWidth: any;
  selectedTitle: string | null;
  onTitleSelect: (title: string | null) => void;
};

function hexToRGBA(hex: string, alpha: number) {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16) || 0;
  const g = parseInt(m.substring(2, 4), 16) || 0;
  const b = parseInt(m.substring(4, 6), 16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

const LevelSection: React.FC<LevelSectionProps> = ({
  levelInfo,
  xpGain,
  justCompleted,
  compact,
  progressColor,
  badgeAnimatedStyle,
  xpGainAnimatedStyle,
  progressAnimatedStyle,
  previousProgressAnimatedStyle,
  gainIndicatorAnimatedStyle,
  hasLevelChanged,
  showLevelUpOverlay,
  previousProgressWidth,
  selectedTitle,
  onTitleSelect,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [levelDescExpanded, setLevelDescExpanded] = useState(false);

  const toggleLevelDescription = useCallback(() => {
    setLevelDescExpanded((s) => !s);
    triggerHaptic("light");
  }, []);

  // Call getLevels() to get fresh translations
  const unlockedTitles = getLevels().slice(0, levelInfo.currentLevel + 1).map((l) => l.name).reverse();

  return (
    <View
      style={[
        styles.sectionCard,
        {
          backgroundColor: theme.isDark ? "rgba(255,255,255,0.03)" : "#fff",
          borderColor: theme.isDark
            ? "rgba(255,255,255,0.10)"
            : "rgba(0,0,0,0.06)",
          elevation: theme.isDark ? 0 : 2, // Elevation nur im Light Mode
        },
      ]}
    >
      {/* Header (Badge + Titel) */}
      <View style={[styles.header, { alignItems: "center", marginBottom: 18 }]}>
        <Animated.View style={badgeAnimatedStyle}>
          <LevelBadge
            levelInfo={levelInfo}
            size={compact ? 44 : 56}
            showAnimation={showLevelUpOverlay}
          />
        </Animated.View>

        <View style={styles.levelInfoContainer}>
          <Text style={[styles.levelName, { color: colors.textPrimary }]}>
            {levelInfo.levelData.name}
          </Text>
        </View>
      </View>

      {/* Gain-Chip */}
      {(xpGain ?? 0) > 0 && justCompleted && (
        <Animated.View
          style={[
            styles.gainChip,
            {
              backgroundColor: theme.isDark
                ? hexToRGBA(progressColor, 0.9)
                : hexToRGBA(progressColor, 1),
              borderColor: theme.isDark
                ? hexToRGBA(progressColor, 0.55)
                : hexToRGBA(progressColor, 0.35),
            },
            xpGainAnimatedStyle,
          ]}
        >
          <Feather name="plus" size={14} color="#FFFFFF" />
          <Text style={[styles.gainChipText, { color: "#FFFFFF" }]}>
            {xpGain} Erfahrungspunkte
          </Text>
        </Animated.View>
      )}

      {/* EP-Fortschritt */}
      <View style={styles.progressSection}>
        <View style={[styles.xpInfoRow, { marginBottom: 8 }]}>
          <Text style={[styles.xpText, { color: colors.textPrimary }]}>
            Level {levelInfo.currentLevel + 1}
          </Text>
          {levelInfo.nextLevelData && (
            <Text style={[styles.xpToGo, { color: colors.textSecondary }]}>
              Noch {levelInfo.xpForNextLevel} EP
            </Text>
          )}
        </View>

        <View style={[styles.progressBarContainer, { height: 12, borderRadius: 6 }]}>
          <View
            style={[
              styles.progressBackground,
              {
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(0,0,0,0.06)",
                borderRadius: 6,
                overflow: "hidden",
                position: "relative",
              },
            ]}
          >
            {/* Aktueller Fortschritt */}
            <Animated.View
              style={[
                styles.progressFill,
                {
                  backgroundColor: progressColor,
                  borderRadius: 6,
                  position: "absolute",
                  height: "100%",
                  left: 0,
                  zIndex: 1,
                },
                progressAnimatedStyle,
              ]}
            />

            {/* Vorheriger Fortschritt (gedimmt) */}
            {justCompleted && (xpGain ?? 0) > 0 && !hasLevelChanged && (
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    height: "100%",
                    backgroundColor: theme.isDark
                      ? `${progressColor}40`
                      : `${progressColor}30`,
                    borderRadius: 6,
                    left: 0,
                    zIndex: 2,
                  },
                  previousProgressAnimatedStyle,
                ]}
              />
            )}

            {/* EP-Gewinn Highlight */}
            {justCompleted && (xpGain ?? 0) > 0 && !hasLevelChanged && (
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    height: "100%",
                    backgroundColor: "#ffffff80",
                    borderRadius: 6,
                    left: `${previousProgressWidth.value}%`,
                    width: `${
                      levelInfo.progressPercentage - previousProgressWidth.value
                    }%`,
                    zIndex: 3,
                    opacity: 1,
                  },
                  gainIndicatorAnimatedStyle,
                ]}
              />
            )}
          </View>
        </View>
      </View>

      {/* Level-Details + Titel-Auswahl (Dropdown) */}
      <Pressable
        onPress={toggleLevelDescription}
        accessibilityRole="button"
        accessibilityLabel="Levelbeschreibung und Titel-Auswahl anzeigen oder verbergen"
        hitSlop={8}
        style={({ pressed }) => [
          styles.levelDetailsCard,
          {
            borderColor: theme.isDark
              ? "rgba(255,255,255,0.12)"
              : "rgba(0,0,0,0.08)",
            backgroundColor: pressed
              ? theme.isDark
                ? "rgba(255,255,255,0.06)"
                : "rgba(0,0,0,0.04)"
              : theme.isDark
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.02)",
          },
        ]}
      >
        <View style={styles.levelDetailsHeader}>
          <View style={styles.levelDetailsHeaderLeft}>
            <View
              style={[
                styles.levelColorDot,
                { backgroundColor: progressColor },
              ]}
            />
            <Text
              style={[
                styles.levelDetailsTitle,
                { color: colors.textPrimary },
              ]}
            >
              Dein Titel
            </Text>
          </View>
          <Feather
            name={levelDescExpanded ? "chevron-up" : "chevron-down"}
            size={18}
            color={colors.textSecondary}
          />
        </View>

        {levelDescExpanded && (
          <Animated.View
            entering={FadeIn.duration(200)}
            style={[
              styles.levelDescriptionBody,
              {
                borderLeftColor: progressColor,
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.035)"
                  : "rgba(0,0,0,0.02)",
              },
            ]}
          >
            {/* Beschreibung */}
            <Text
              style={[
                styles.levelMessage,
                { color: colors.textSecondary, marginBottom: 12 },
              ]}
            >
              {levelInfo.levelData.message}
            </Text>

            {/* Aktueller Titel */}
            <View style={styles.titleCurrentBlock}>
              <View style={styles.titleCurrentHeader}>
                <Feather name="award" size={16} color={progressColor} />
                <Text
                  style={[
                    styles.titleCurrentText,
                    { color: colors.textPrimary },
                  ]}
                >
                  Aktueller Titel:
                </Text>
              </View>

              <View
                style={[
                  styles.titlePill,
                  {
                    backgroundColor: hexToRGBA(
                      progressColor,
                      theme.isDark ? 0.25 : 0.15
                    ),
                    borderColor: hexToRGBA(
                      progressColor,
                      theme.isDark ? 0.45 : 0.3
                    ),
                  },
                ]}
              >
                <Text
                  style={[
                    styles.titlePillText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {selectedTitle || "—"}
                </Text>
              </View>
            </View>

            {/* Auswahl freigeschalteter Titel */}
            <TitleSelect
              titles={unlockedTitles}
              selected={selectedTitle}
              onSelect={onTitleSelect}
              color={progressColor}
              isDark={theme.isDark}
            />
          </Animated.View>
        )}
      </Pressable>
    </View>
  );
};

export default LevelSection;
