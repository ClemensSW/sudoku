import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  gameContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
  },

  timerContainer: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },

  boardContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  controlsContainer: {
    flex: 1,
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.lg,
    width: "100%",
    gap: spacing.md,
  },

  button: {
    flex: 1,
    maxWidth: 170,
  },

  // Background decorative elements
  topDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: -1,
  },

  gameStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },

  statItem: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.sm,
    borderRadius: 12,
    width: 100,
  },

  statValue: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },

  statLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
});
