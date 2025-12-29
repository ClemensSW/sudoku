// screens/Duo/components/MatchHistoryCard/MatchHistoryCard.tsx
import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeIn, FadeInDown, SlideInRight } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useCurrentLeague } from "@/hooks/useCurrentLeague";
import styles from "./MatchHistoryCard.styles";

// SVG Icon
import HourglassIcon from "@/assets/svg/hourglass.svg";

// Zone Colors (matching LeaderboardCard)
const PROMOTION_COLOR = "#4CAF50"; // Grün - für Siege
const DEMOTION_COLOR = "#E57373";  // Rot - für Niederlagen

interface MatchEntry {
  id: string;
  won: boolean;
  opponent: string;
  eloChange: number;
  timeAgo: string;
}

// Dummy match history
const DUMMY_MATCHES: MatchEntry[] = [
  { id: "1", won: true, opponent: "SudokuFan22", eloChange: 18, timeAgo: "2h" },
  { id: "2", won: false, opponent: "ProGamer", eloChange: -12, timeAgo: "5h" },
  { id: "3", won: true, opponent: "Anfänger123", eloChange: 24, timeAgo: "1d" },
];

// Helper to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const MatchHistoryCard: React.FC = () => {
  const { t } = useTranslation("duo");
  const theme = useTheme();
  const colors = theme.colors;
  const { colors: leagueColors } = useCurrentLeague();

  // Theme-aware colors
  const cardBg = theme.isDark ? colors.surface : "#FFFFFF";
  const cardBorder = theme.isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";
  const dividerColor = theme.isDark
    ? "rgba(255,255,255,0.10)"
    : "rgba(0,0,0,0.08)";

  // Format time ago
  const formatTimeAgo = (timeAgo: string): string => {
    if (timeAgo === "1d") {
      return t("history.yesterday", { defaultValue: "gestern" });
    }
    return t("history.ago", { time: timeAgo, defaultValue: `vor ${timeAgo}` });
  };

  const hasMatches = DUMMY_MATCHES.length > 0;

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          shadowColor: theme.isDark ? "transparent" : leagueColors.accent,
          elevation: theme.isDark ? 0 : 8,
        },
      ]}
      entering={FadeIn.duration(400).delay(200)}
    >
      {/* Header - zentriert wie Liga Header */}
      <View style={styles.header}>
        <HourglassIcon width={64} height={64} />
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          {t("history.title", { defaultValue: "Letzte Spiele" })}
        </Text>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: dividerColor }]} />

      {hasMatches ? (
        <View style={styles.matches}>
          {DUMMY_MATCHES.map((match, index) => {
            const resultColor = match.won ? PROMOTION_COLOR : DEMOTION_COLOR;

            return (
              <Animated.View
                key={match.id}
                style={[
                  styles.matchRow,
                  index < DUMMY_MATCHES.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: dividerColor,
                  },
                ]}
                entering={SlideInRight.duration(300).delay(250 + index * 75)}
              >
                <View style={styles.matchLeft}>
                  {/* Result Indicator */}
                  <View
                    style={[
                      styles.resultIndicator,
                      { backgroundColor: hexToRGBA(resultColor, 0.15) },
                    ]}
                  >
                    <Feather
                      name={match.won ? "check" : "x"}
                      size={16}
                      color={resultColor}
                    />
                  </View>

                  {/* Match Info */}
                  <View style={styles.matchInfo}>
                    <View style={styles.opponentRow}>
                      <Text style={[styles.vsText, { color: colors.textSecondary }]}>
                        {t("history.vs", { defaultValue: "vs" })}
                      </Text>
                      <Text
                        style={[styles.opponentName, { color: colors.textPrimary }]}
                        numberOfLines={1}
                      >
                        {match.opponent}
                      </Text>
                    </View>
                    <Text style={[styles.timeText, { color: colors.textSecondary }]}>
                      {formatTimeAgo(match.timeAgo)}
                    </Text>
                  </View>
                </View>

                {/* ELO Change */}
                <Text style={[styles.eloChange, { color: resultColor }]}>
                  {match.eloChange > 0 ? "+" : ""}
                  {match.eloChange} ELO
                </Text>
              </Animated.View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Feather
            name="inbox"
            size={24}
            color={colors.textSecondary}
            style={{ marginBottom: 8 }}
          />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {t("history.noGames", { defaultValue: "Noch keine Spiele" })}
          </Text>
        </View>
      )}
    </Animated.View>
  );
};

export default MatchHistoryCard;
