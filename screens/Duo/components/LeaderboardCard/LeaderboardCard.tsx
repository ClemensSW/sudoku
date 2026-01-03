// screens/Duo/components/LeaderboardCard/LeaderboardCard.tsx
import React, { useState, useCallback } from "react";
import { View, Text, Image } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { getRankTierName } from "@/utils/elo/eloCalculator";
import { useCurrentLeague } from "@/hooks/useCurrentLeague";
import { useDevLeague } from "@/contexts/DevLeagueContext";
import { ComingSoonOverlay } from "@/components/ComingSoonOverlay";
import {
  getAvatarSourceFromUri,
  DEFAULT_AVATAR,
} from "@/screens/Leistung/utils/defaultAvatars";
import { loadUserProfile } from "@/utils/profileStorage";
import styles from "./LeaderboardCard.styles";

// SVG Icon
import SilverBadgeIcon from "@/assets/svg/silver-badge.svg";

// Zone Colors
const PROMOTION_COLOR = "#4CAF50"; // Grün
const DEMOTION_COLOR = "#E57373"; // Rot


// Helper to convert hex to rgba
const hexToRGBA = (hex: string, alpha: number): string => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Player interface
interface LeaguePlayer {
  rank: number;
  name: string;
  points: number;
  avatarUri: string | null;
  isCurrentUser?: boolean;
}

// Dummy players for design preview
const DUMMY_PLAYERS: LeaguePlayer[] = [
  // Promotion zone (Top 3)
  { rank: 1, name: "ProPlayer99", points: 1247, avatarUri: "default://avatar42" },
  { rank: 2, name: "SudokuKing", points: 1198, avatarUri: "default://avatar17" },
  { rank: 3, name: "QuickFingers", points: 1156, avatarUri: "default://avatar89" },
  // Middle zone
  { rank: 4, name: "PuzzleMaster", points: 1089, avatarUri: "default://avatar33" },
  { rank: 5, name: "GridWizard", points: 1045, avatarUri: "default://avatar51" },
  { rank: 6, name: "Clemens", points: 1012, avatarUri: null, isCurrentUser: true },
  { rank: 7, name: "NumberNinja", points: 987, avatarUri: "default://avatar77" },
  // Demotion zone (Bottom 3)
  { rank: 8, name: "CasualPlayer", points: 923, avatarUri: "default://avatar25" },
  { rank: 9, name: "NewPlayer42", points: 891, avatarUri: "default://avatar103" },
  { rank: 10, name: "Beginner01", points: 845, avatarUri: "default://avatar61" },
];

const LeaderboardCard: React.FC = () => {
  const { t } = useTranslation("duo");
  const { colors, typography, isDark } = useTheme();
  const { tier, colors: leagueColors } = useCurrentLeague();
  const devLeague = useDevLeague();
  const onlineFeaturesEnabled = devLeague?.onlineFeaturesEnabled ?? false;

  // Load current user's profile data (reload on screen focus)
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>("User");

  useFocusEffect(
    useCallback(() => {
      const loadUserData = async () => {
        // Load profile (name + avatar)
        const profile = await loadUserProfile();
        setCurrentUserName(profile.name || "User");
        setCurrentUserAvatar(profile.avatarUri || null);
      };
      loadUserData();
    }, [])
  );

  // League colors from useCurrentLeague
  const leagueColor = leagueColors.primary;
  const leagueName = t(`league.${tier}`, {
    defaultValue: getRankTierName(tier) + " Liga",
  });

  // Card colors
  const cardBg = isDark ? colors.surface : "#FFFFFF";
  const cardBorder = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";
  const dividerColor = isDark
    ? "rgba(255,255,255,0.08)"
    : "rgba(0,0,0,0.06)";

  // Zone colors
  const promotionBg = isDark
    ? hexToRGBA(PROMOTION_COLOR, 0.15)
    : hexToRGBA(PROMOTION_COLOR, 0.08);
  const demotionBg = isDark
    ? hexToRGBA(DEMOTION_COLOR, 0.15)
    : hexToRGBA(DEMOTION_COLOR, 0.08);
  const currentUserBg = isDark
    ? hexToRGBA(leagueColor, 0.2)
    : hexToRGBA(leagueColor, 0.1);

  // Split players into zones
  const promotionPlayers = DUMMY_PLAYERS.slice(0, 3);
  const middlePlayers = DUMMY_PLAYERS.slice(3, 7);
  const demotionPlayers = DUMMY_PLAYERS.slice(7, 10);

  // Render a single player row
  const renderPlayerRow = (player: LeaguePlayer, index: number, delay: number) => (
    <Animated.View
      key={player.rank}
      style={[
        styles.playerRow,
        player.isCurrentUser && [
          styles.currentUserRow,
          { backgroundColor: currentUserBg },
        ],
      ]}
      entering={FadeInDown.duration(300).delay(delay)}
    >
      {/* Rank */}
      <Text
        style={[
          styles.rankNumber,
          { color: player.isCurrentUser ? leagueColor : colors.textSecondary, fontSize: typography.size.md },
        ]}
      >
        {player.rank}.
      </Text>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={getAvatarSourceFromUri(
            player.isCurrentUser ? currentUserAvatar : player.avatarUri,
            DEFAULT_AVATAR
          )}
          style={styles.avatar}
          resizeMode="cover"
        />
      </View>

      {/* Name */}
      <Text
        style={[
          styles.playerName,
          { color: colors.textPrimary, fontSize: typography.size.md },
          player.isCurrentUser && styles.currentUserName,
        ]}
        numberOfLines={1}
      >
        {player.isCurrentUser ? currentUserName : player.name}
      </Text>

      {/* Points */}
      <Text
        style={[
          styles.playerPoints,
          { color: player.isCurrentUser ? leagueColor : colors.textSecondary, fontSize: typography.size.md },
        ]}
      >
        {player.points.toLocaleString("de-DE")}
      </Text>
    </Animated.View>
  );

  return (
    <Animated.View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: cardBorder,
          // Shadow with league color glow
          shadowColor: isDark ? "transparent" : leagueColor,
          elevation: isDark ? 0 : 8,
        },
      ]}
      entering={FadeIn.duration(400).delay(100)}
    >
      {/* League Header */}
        <View style={styles.leagueHeader}>
          <View
            style={[
              styles.leagueIconContainer,
              {
                backgroundColor: isDark
                  ? hexToRGBA(leagueColor, 0.25)
                  : hexToRGBA(leagueColor, 0.15),
                // Glow effect
                shadowColor: leagueColor,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: isDark ? 0.5 : 0.35,
                shadowRadius: 16,
                elevation: 8,
              },
            ]}
          >
            <SilverBadgeIcon width={56} height={56} />
          </View>
          <Text style={[styles.leagueName, { color: colors.textPrimary, fontSize: typography.size.xl }]}>
            {leagueName}
          </Text>
        </View>

        {/* Divider */}
        <View style={[styles.zoneDivider, { backgroundColor: dividerColor }]} />

        {/* Promotion Zone Header */}
        <View style={[styles.zoneHeader, { backgroundColor: promotionBg }]}>
          <Feather name="arrow-up" size={14} color={PROMOTION_COLOR} />
          <Text style={[styles.zoneText, { color: PROMOTION_COLOR, fontSize: typography.size.xs }]}>
            {t("league.promotionZone", { defaultValue: "Aufstiegszone" })}
          </Text>
        </View>

        {/* Promotion Players (Top 3) */}
        <View style={styles.playerList}>
          {promotionPlayers.map((player, index) =>
            renderPlayerRow(player, index, 150 + index * 40)
          )}
        </View>

        {/* Divider */}
        <View style={[styles.zoneDivider, { backgroundColor: dividerColor }]} />

        {/* Middle Zone (no header) */}
        <View style={styles.playerList}>
          {middlePlayers.map((player, index) =>
            renderPlayerRow(player, index, 300 + index * 40)
          )}
        </View>

        {/* Divider */}
        <View style={[styles.zoneDivider, { backgroundColor: dividerColor }]} />

        {/* Demotion Zone Header */}
        <View style={[styles.zoneHeader, { backgroundColor: demotionBg }]}>
          <Feather name="arrow-down" size={14} color={DEMOTION_COLOR} />
          <Text style={[styles.zoneText, { color: DEMOTION_COLOR, fontSize: typography.size.xs }]}>
            {t("league.demotionZone", { defaultValue: "Abstiegszone" })}
          </Text>
        </View>

        {/* Demotion Players (Bottom 3) */}
        <View style={styles.playerList}>
          {demotionPlayers.map((player, index) =>
            renderPlayerRow(player, index, 500 + index * 40)
          )}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />

        {/* Coming Soon Overlay - shown when online features are disabled */}
        {!onlineFeaturesEnabled && (
          <ComingSoonOverlay
            text={t("comingSoon", { defaultValue: "BALD VERFÜGBAR" })}
            borderRadius={20}
          />
        )}
    </Animated.View>
  );
};

export default LeaderboardCard;
