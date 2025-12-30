// screens/Duo/components/DuoStatsBar/DuoStatsBar.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Container - fixed at top
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
    zIndex: 100,
  },

  // Stats row container
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  // Individual stat item
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  // Icon container
  iconContainer: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },

  // Stat value text
  statValue: {
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },

  // Stat label text
  statLabel: {
    fontWeight: "500",
  },

  // Separator dot
  separator: {
    opacity: 0.4,
    paddingHorizontal: 2,
  },
});

export default styles;
