import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 9999, // Erhöhter zIndex
    elevation: 10, // Für Android
  },

  modalContainer: {
    width: "90%",
    maxWidth: 400,
    borderRadius: radius.xl,
    padding: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },

  headerContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.xs,
  },

  headerBanner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: radius.xl,
    marginTop: spacing.xs,
  },

  headerBannerText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },

  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: spacing.lg,
  },

  performanceContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 120,
  },

  performanceLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: spacing.xs,
  },

  superPerformanceBadge: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },

  superPerformanceText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  timeStatsContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingLeft: spacing.md,
  },

  timeStatItem: {
    alignItems: "center",
    flex: 1,
  },

  timeStatValue: {
    fontSize: 22,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },

  bestTimeValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  timeStatLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 2,
  },

  timeStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(150, 150, 150, 0.2)",
    marginHorizontal: spacing.sm,
  },

  difficultyTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.lg,
    borderWidth: 2,
    alignSelf: "center",
    marginBottom: spacing.md,
  },

  difficultyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "white",
  },

  // Streak-Styles (für die Anzeige der aktuellen Gewinnsträhne)
  streakContainer: {
    alignItems: "center",
    marginVertical: spacing.md,
    padding: spacing.sm,
  },

  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.xl,
    marginBottom: spacing.xs,
    borderWidth: 2,
  },

  streakIcon: {
    marginRight: spacing.xs,
  },

  streakValue: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },

  streakLabel: {
    fontSize: 14,
    marginTop: spacing.xxs,
  },

  recordStreakBadge: {
    marginTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },

  recordStreakText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },

  // Combined styles for stars and difficulty
  starsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.md,
    flexDirection: "column",
  },

  starIcon: {
    marginHorizontal: spacing.xs,
  },

  messageContainer: {
    marginVertical: spacing.md,
    padding: spacing.lg,
    borderRadius: radius.lg,
    width: "100%",
  },

  motivationalMessage: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 26,
  },

  newRecordBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginLeft: spacing.xs,
  },

  newRecordText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },

  autoNotesContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.md,
    padding: spacing.md,
    marginVertical: spacing.md,
  },

  infoIcon: {
    marginRight: spacing.xs,
  },

  autoNotesText: {
    fontSize: 14,
    flex: 1,
  },

  // Button styles
  actionButtonsContainer: {
    width: "100%",
    flexDirection: "column",
    marginTop: spacing.lg,
  },

  primaryButton: {
    width: "100%",
    marginBottom: spacing.md,
  },

  secondaryButton: {
    width: "100%",
  },
});
