// screens/Duo/components/MatchHistoryCard/MatchHistoryCard.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Card container (shadow like LeaderboardCard)
  card: {
    marginHorizontal: 20,
    marginTop: 0,
    marginBottom: 24,
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
    // Shadow (matching LeaderboardCard glow effect)
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    // elevation is set dynamically in component
  },

  // Header - zentriert wie Liga Header
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: 12,
  },

  // Divider
  divider: {
    height: 1,
    marginHorizontal: 16,
  },

  // Matches container
  matches: {
    paddingVertical: 4,
  },

  // Match row
  matchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  matchLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },

  // Result indicator
  resultIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  resultIcon: {
    fontSize: 14,
    fontWeight: "700",
  },

  // Match info
  matchInfo: {
    flex: 1,
  },
  opponentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  vsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  opponentName: {
    fontSize: 14,
    fontWeight: "600",
  },
  timeText: {
    fontSize: 11,
    marginTop: 2,
  },

  // ELO change
  eloChange: {
    fontSize: 14,
    fontWeight: "700",
    minWidth: 60,
    textAlign: "right",
  },

  // Empty state
  emptyState: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default styles;
