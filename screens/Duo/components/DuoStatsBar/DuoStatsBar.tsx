// screens/Duo/components/DuoStatsBar/DuoStatsBar.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useCurrentLeague } from "@/hooks/useCurrentLeague";
import { triggerHaptic } from "@/utils/haptics";

// SVG Icons
import SilverBadgeIcon from "@/assets/svg/silver-badge.svg";
import ZielIcon from "@/assets/svg/ziel.svg";
import LightningIcon from "@/assets/svg/lightning.svg";

import styles from "./DuoStatsBar.styles";

interface DuoStatsBarProps {
  elo: number;
  wins: number;
  losses: number;
  currentStreak: number;
  onEloPress?: () => void;
  onRecordPress?: () => void;
  onStreakPress?: () => void;
}

const DuoStatsBar: React.FC<DuoStatsBarProps> = ({
  elo,
  wins,
  losses,
  currentStreak,
  onEloPress,
  onRecordPress,
  onStreakPress,
}) => {
  const { colors, typography, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { colors: leagueColors } = useCurrentLeague();

  // Handle press with haptic feedback
  const handlePress = (callback?: () => void) => {
    if (callback) {
      triggerHaptic("light");
      callback();
    }
  };

  // Colors
  const borderColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)";
  const bgColor = colors.background;
  const separatorColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)";

  return (
    <Animated.View
      style={[
        styles.container,
        {
          paddingTop: insets.top + 8,
          backgroundColor: bgColor,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          // Shadow
          shadowColor: isDark ? "transparent" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0 : 0.08,
          shadowRadius: 4,
          elevation: isDark ? 0 : 3,
        },
      ]}
      entering={FadeInDown.duration(300)}
    >
      <View style={styles.statsRow}>
        {/* League Icon + ELO */}
        <Pressable
          onPress={() => handlePress(onEloPress)}
          style={({ pressed }) => [
            styles.statItem,
            {
              backgroundColor: pressed
                ? isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)"
                : "transparent",
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDark
                  ? `${leagueColors.primary}30`
                  : `${leagueColors.primary}20`,
              },
            ]}
          >
            <SilverBadgeIcon width={18} height={18} />
          </View>
          <Text
            style={[
              styles.statValue,
              { color: colors.textPrimary, fontSize: typography.size.md },
            ]}
          >
            {elo.toLocaleString()}
          </Text>
        </Pressable>

        {/* Separator */}
        <Text style={[styles.separator, { color: separatorColor }]}>-</Text>

        {/* Balance Icon + W-L Record */}
        <Pressable
          onPress={() => handlePress(onRecordPress)}
          style={({ pressed }) => [
            styles.statItem,
            {
              backgroundColor: pressed
                ? isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)"
                : "transparent",
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <ZielIcon width={18} height={18} />
          </View>
          <Text
            style={[
              styles.statValue,
              { color: colors.textPrimary, fontSize: typography.size.md },
            ]}
          >
            {wins}-{losses}
          </Text>
        </Pressable>

        {/* Separator */}
        <Text style={[styles.separator, { color: separatorColor }]}>-</Text>

        {/* Streak Icon + Streak */}
        <Pressable
          onPress={() => handlePress(onStreakPress)}
          style={({ pressed }) => [
            styles.statItem,
            {
              backgroundColor: pressed
                ? isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.04)"
                : "transparent",
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <LightningIcon width={18} height={18} />
          </View>
          <Text
            style={[
              styles.statValue,
              { color: colors.textPrimary, fontSize: typography.size.md },
            ]}
          >
            {currentStreak}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

export default DuoStatsBar;
