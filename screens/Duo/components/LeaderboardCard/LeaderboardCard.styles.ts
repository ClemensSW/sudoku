// screens/Duo/components/LeaderboardCard/LeaderboardCard.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Card container (shadow like PlayerStatsHero)
  card: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    // Shadow (matching PlayerStatsHero glow effect)
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    // elevation is set dynamically in component
  },

  // Liga Header (Hero-Style) - 48px spacing to icon
  leagueHeader: {
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  leagueIconContainer: {
    marginTop: 16,
  },
  leagueName: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 12,
  },

  // Zone Header (Aufstieg/Abstieg)
  zoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 6,
  },
  zoneText: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Player list container
  playerList: {
    paddingVertical: 4,
  },

  // Player Row
  playerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  currentUserRow: {
    borderRadius: 14,
    marginHorizontal: 8,
    marginVertical: 4,
    paddingHorizontal: 12,
  },

  // Rank number
  rankNumber: {
    width: 28,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },

  // Avatar
  avatarContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    marginLeft: 8,
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },

  // Player name
  playerName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
  },
  currentUserName: {
    fontWeight: "700",
  },

  // Points
  playerPoints: {
    fontSize: 15,
    fontWeight: "700",
    minWidth: 55,
    textAlign: "right",
  },

  // Divider between zones
  zoneDivider: {
    height: 1,
    marginHorizontal: 16,
  },

  // Bottom padding
  bottomPadding: {
    height: 8,
  },
});

export default styles;
