import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  // Header with win rate and profile
  headerContainer: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
  },

  winRateContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  winRateLabel: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    marginTop: spacing.xs,
  },

  profileContainer: {
    flex: 1,
    justifyContent: "center",
  },

  levelContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },

  levelNumber: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: spacing.xs,
  },

  playerLevel: {
    color: "white",
    fontSize: 20,
    fontWeight: "700",
  },

  motivationalText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    fontWeight: "500",
    marginBottom: spacing.sm,
  },

  levelProgressContainer: {
    width: "100%",
  },

  levelProgress: {
    height: 6,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: spacing.xxs,
  },

  levelProgressFill: {
    height: "100%",
    backgroundColor: "white",
    borderRadius: 3,
  },

  levelProgressText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 11,
    fontWeight: "500",
  },

  // Statistics grid
  statsGridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },

  statBox: {
    width: "48%",
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    marginBottom: spacing.md,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  statValue: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: spacing.xs,
  },

  statLabel: {
    fontSize: 14,
    fontWeight: "500",
  },

  // Best times chart
  bestTimesContainer: {
    width: "100%",
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },

  chartContainer: {
    marginTop: spacing.sm,
  },

  chartRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
    height: 36,
  },

  chartLabelContainer: {
    width: 65,
  },

  chartLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  chartBarBackground: {
    flex: 1,
    height: 12,
    borderRadius: radius.md,
    marginRight: spacing.md,
    overflow: "hidden",
  },

  chartBar: {
    height: "100%",
    borderRadius: radius.md,
  },

  chartValue: {
    fontSize: 14,
    fontWeight: "600",
    width: 50,
    textAlign: "right",
    fontVariant: ["tabular-nums"],
  },

  // Badge section styles (falls man sie später wieder aktivieren möchte)
  badgesContainer: {
    width: "100%",
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  badgeItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  badgeIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xs,
    borderWidth: 2,
  },

  badgeTitle: {
    fontSize: 12,
    textAlign: "center",
  },

  motivationText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.md,
    fontWeight: "500",
  },
});
