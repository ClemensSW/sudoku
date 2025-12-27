// screens/Duo/components/MatchHistoryCard/MatchHistoryCard.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Card container
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    // Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
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
