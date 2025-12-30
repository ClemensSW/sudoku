// screens/Duo/components/LeaderboardCard/LeaderboardCard.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Card container (shadow like PlayerStatsHero)
  card: {
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 24,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden", // Clip content at card boundary
    // Shadow (matching PlayerStatsHero glow effect)
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    // elevation is set dynamically in component
  },

  // Liga Header - kompakter
  leagueHeader: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  leagueIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  leagueName: {
    // fontSize set dynamically via theme.typography
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 12,
  },

  // Progress bar container
  progressContainer: {
    width: "100%",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFillGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
  progressText: {
    fontWeight: "600",
    textAlign: "center",
  },

  // Dev Ribbon (corner banner - clipped at card edge)
  ribbonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 110,
    height: 110,
    overflow: "hidden", // Clips ribbon at card boundary
    zIndex: 10,
    borderTopRightRadius: 20, // Match card border radius
  },
  ribbonWrapper: {
    position: "absolute",
    top: 18,
    right: -32,
    transform: [{ rotate: "45deg" }],
  },
  ribbon: {
    paddingVertical: 5,
    paddingHorizontal: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 6,
  },
  ribbonIcon: {
    marginRight: 4,
  },
  ribbonText: {
    fontSize: 7,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
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
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
    fontWeight: "500",
  },
  currentUserName: {
    fontWeight: "700",
  },

  // Points
  playerPoints: {
    // fontSize set dynamically via theme.typography
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
