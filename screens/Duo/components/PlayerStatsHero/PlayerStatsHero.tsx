// screens/Duo/components/PlayerStatsHero/PlayerStatsHero.tsx
import React from "react";
import { Text, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useCurrentLeague } from "@/hooks/useCurrentLeague";
import { triggerHaptic } from "@/utils/haptics";

// SVG Icons
import BattleIcon from "@/assets/svg/battle.svg";

import styles from "./PlayerStatsHero.styles";

// Height of the DuoStatsBar (to offset content)
const STATS_BAR_HEIGHT = 52;
// Extra spacing for Battle Icon from top
const EXTRA_TOP_SPACING = 40;

// Helper to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

interface PlayerStatsHeroProps {
  onTutorialPress?: () => void;
}

const PlayerStatsHero: React.FC<PlayerStatsHeroProps> = ({ onTutorialPress }) => {
  const { t } = useTranslation("duo");
  const { colors, typography, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { colors: leagueColors } = useCurrentLeague();

  return (
    <LinearGradient
      colors={
        isDark
          ? [
              hexToRGBA(leagueColors.accent, 0.15),
              hexToRGBA(leagueColors.accent, 0.05),
              "transparent",
            ]
          : [
              hexToRGBA(leagueColors.accent, 0.2),
              hexToRGBA(leagueColors.accent, 0.08),
              "transparent",
            ]
      }
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.heroSection, { paddingTop: insets.top + STATS_BAR_HEIGHT + EXTRA_TOP_SPACING }]}
    >
      {/* Battle Icon - Duo Mode Identifier */}
      <Animated.View
        style={styles.battleIconContainer}
        entering={FadeInDown.duration(400).delay(100)}
      >
        <BattleIcon width={120} height={120} />
      </Animated.View>

      {/* Title Section */}
      <Animated.View
        style={styles.titleSection}
        entering={FadeInDown.duration(400).delay(150)}
      >
        <Text
          style={[
            styles.subtitle,
            { color: colors.textSecondary, fontSize: typography.size.xs },
          ]}
        >
          {t("header.subtitle", { defaultValue: "ZWEI SPIELER MODUS" })}
        </Text>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontSize: typography.size.xxl },
          ]}
        >
          {t("header.title", { defaultValue: "Sudoku Duo" })}
        </Text>
        {onTutorialPress && (
          <Pressable
            onPress={() => {
              triggerHaptic("light");
              onTutorialPress();
            }}
            style={({ pressed }) => [
              styles.infoButton,
              {
                opacity: pressed ? 0.6 : 1,
                backgroundColor: pressed
                  ? isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)"
                  : "transparent",
              },
            ]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Feather name="info" size={18} color={colors.textSecondary} />
          </Pressable>
        )}
      </Animated.View>
    </LinearGradient>
  );
};

export default PlayerStatsHero;
