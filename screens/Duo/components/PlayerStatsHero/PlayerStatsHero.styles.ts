// screens/Duo/components/PlayerStatsHero/PlayerStatsHero.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Card container with glowing shadow (like LevelCard)
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden", // Clips shadow to rounded corners
    // iOS Shadow (glowing effect)
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  // Hero header with gradient
  heroHeader: {
    paddingTop: 24,
    paddingBottom: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },

  // Battle icon - Duo Mode identifier (like LevelCard badge)
  battleIconContainer: {
    marginBottom: 24,
  },

  // Title section
  titleSection: {
    alignItems: "center",
    marginBottom: 24,
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
    alignItems: "flex-start",
    marginBottom: 24,
    gap: 16,
  },

  // Individual stat tile - clean, no background
  statTile: {
    alignItems: "center",
    paddingVertical: 8,
    flex: 1,
  },

  // Circular icon container (like StreakCard)
  statIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  statValue: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Rank badge section - horizontal layout with icon circle
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 14,
    gap: 12,
  },
  rankIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
