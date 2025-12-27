// screens/Duo/components/LeaderboardCard/LeaderboardCard.styles.ts
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  comingSoonBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Divider
  divider: {
    height: 1,
    marginHorizontal: 16,
  },

  // Entries container
  entries: {
    paddingVertical: 8,
  },

  // Entry row
  entryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  entryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },

  // Medal
  medal: {
    fontSize: 18,
    width: 28,
    textAlign: "center",
  },

  // Rank number
  rank: {
    fontSize: 13,
    fontWeight: "600",
    width: 32,
  },

  // Tier badge (small colored badge with icon)
  tierBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
    marginRight: 8,
  },
  tierText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
  },

  // Player name
  name: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },

  // Rating
  rating: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 50,
    textAlign: "right",
  },

  // Dotted separator
  dottedSeparator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
  },
  dots: {
    fontSize: 14,
    letterSpacing: 4,
  },

  // User position row (highlighted)
  userRow: {
    marginTop: 4,
    marginHorizontal: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 2,
  },
  userRowContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  youBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginLeft: 8,
  },
  youText: {
    fontSize: 10,
    fontWeight: "700",
  },
});

export default styles;
