// components/GameCompletionModal/components/PlayerProgressionCard/components/PathSection.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";
import PathTrail from "./PathTrail";
import MilestoneNotification from "./MilestoneNotification";
import { LevelInfo } from "../utils/types";
import styles from "../PlayerProgressionCard.styles";

type PathSectionProps = {
  levelInfo: LevelInfo;
  previousLevelInfo: LevelInfo;
  progressColor: string;
  showPathDescription: boolean;
  milestoneLevels: number[];
  showMilestone?: boolean;
  milestoneMessage?: string;
  milestoneLevel?: number;
  onCloseMilestone?: () => void;
  textPrimaryColor?: string;
  textSecondaryColor?: string;
  isDark?: boolean;
};

function hexToRGBA(hex: string, alpha: number) {
  const m = hex.replace("#", "");
  const r = parseInt(m.substring(0, 2), 16) || 0;
  const g = parseInt(m.substring(2, 4), 16) || 0;
  const b = parseInt(m.substring(4, 6), 16) || 0;
  return `rgba(${r},${g},${b},${alpha})`;
}

const PathSection: React.FC<PathSectionProps> = ({
  levelInfo,
  previousLevelInfo,
  progressColor,
  showPathDescription,
  milestoneLevels,
  showMilestone = false,
  milestoneMessage = "",
  milestoneLevel = 0,
  onCloseMilestone,
  textPrimaryColor,
  textSecondaryColor,
  isDark: isDarkProp,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [pathDescExpanded, setPathDescExpanded] = useState(false);

  const isDark = isDarkProp ?? theme.isDark;

  const togglePathDescription = useCallback(() => {
    setPathDescExpanded((s) => !s);
    triggerHaptic("light");
  }, []);

  return (
    <View
      style={[
        styles.sectionCard,
        {
          backgroundColor: theme.isDark ? "rgba(255,255,255,0.03)" : "#fff",
          borderColor: theme.isDark
            ? "rgba(255,255,255,0.10)"
            : "rgba(0,0,0,0.06)",
        },
      ]}
    >
      {/* Card-Header mit Icon + Titel */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <View
            style={[
              styles.headerIconWrap,
              {
                backgroundColor: theme.isDark
                  ? hexToRGBA(progressColor, 0.2)
                  : hexToRGBA(progressColor, 0.12),
                borderColor: theme.isDark
                  ? hexToRGBA(progressColor, 0.35)
                  : hexToRGBA(progressColor, 0.25),
              },
            ]}
          >
            <Feather name="map" size={14} color={progressColor} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Deine Reise
          </Text>
        </View>
      </View>

      {/* Trail */}
      <PathTrail
        color={progressColor}
        isDark={theme.isDark}
        currentLevel={levelInfo.currentLevel}
        previousLevel={previousLevelInfo.currentLevel}
        milestoneLevels={milestoneLevels}
      />

      {/* Vollflächig klickbarer Path-Details-Button */}
      {showPathDescription && (
        <Pressable
          onPress={togglePathDescription}
          accessibilityRole="button"
          accessibilityLabel="Pfaddetails anzeigen oder verbergen"
          style={({ pressed }) => [
            styles.pathDetailsCard,
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
          hitSlop={8}
        >
          <View style={styles.pathDetailsHeader}>
            <View style={styles.pathDetailsHeaderLeft}>
              <View
                style={[
                  styles.pathColorDot,
                  { backgroundColor: progressColor },
                ]}
              />
              <Text
                style={[
                  styles.descriptionTitle,
                  { color: colors.textPrimary },
                ]}
              >
                {levelInfo.currentPath.name}
              </Text>
            </View>

            <View style={styles.pathDetailsHeaderRight}>
              <Feather
                name={pathDescExpanded ? "chevron-up" : "chevron-down"}
                size={18}
                color={colors.textSecondary}
              />
            </View>
          </View>

          {pathDescExpanded && (
            <Animated.View
              style={[
                styles.descriptionBody,
                {
                  borderLeftColor: progressColor,
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.035)"
                    : "rgba(0,0,0,0.02)",
                },
              ]}
              entering={FadeIn.duration(240)}
            >
              <Text
                style={[
                  styles.descriptionText,
                  { color: colors.textSecondary },
                ]}
              >
                {levelInfo.currentPath.description}
              </Text>
            </Animated.View>
          )}
        </Pressable>
      )}

      {/* Milestone Notification */}
      {showMilestone && onCloseMilestone && (
        <MilestoneNotification
          visible={showMilestone}
          message={milestoneMessage}
          milestoneLevel={milestoneLevel}
          color={progressColor}
          isDark={isDark}
          onClose={onCloseMilestone}
          textPrimaryColor={textPrimaryColor ?? colors.textPrimary}
          textSecondaryColor={textSecondaryColor ?? colors.textSecondary}
        />
      )}
    </View>
  );
};

export default PathSection;
