// screens/Duo/components/PlayerStatsHero/PlayerStatsHero.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Card container
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
    // Shadow for light mode
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  // Hero header with gradient
  heroHeader: {
    paddingTop: 24,
    paddingBottom: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  // Title section
  titleSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  // Individual stat tile
  statTile: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 85,
  },
  statIcon: {
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // Rank badge section
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 10,
  },
  rankIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  rankTextContainer: {
    flex: 1,
  },
  rankName: {
    fontSize: 16,
    fontWeight: "700",
  },
  rankProgress: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },

  // Login prompt (when not logged in)
  loginPrompt: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default styles;
