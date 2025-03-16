// screens/DuoGameScreen/DuoGameScreen.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between", // Distribute space between top and bottom controls
    paddingHorizontal: 4, // Reduced horizontal padding
    paddingVertical: spacing.md,
  },
  // Upper section for Player 2
  upperSection: {
    width: "100%",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  // Lower section for Player 1
  lowerSection: {
    width: "100%",
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  // Status indicators
  statusIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: spacing.lg,
    marginVertical: spacing.xs,
  },
  playerStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginRight: spacing.xs,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  // Player info section
  playerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  playerInfo: {
    alignItems: "center",
    borderRadius: spacing.sm,
    padding: spacing.sm,
    minWidth: 120,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.xxs,
  },
  playerStatus: {
    fontSize: 12,
    marginTop: spacing.xxs,
  },
  activePlayer: {
    borderWidth: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: "100%",
    marginVertical: spacing.sm,
  },
  completedText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50", // Green for completed
    marginTop: 4,
  },
  // Hint counter
  hintCounter: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: spacing.md,
  },
  hintIcon: {
    marginRight: spacing.xxs,
  },
  hintCount: {
    fontSize: 14,
    fontWeight: "600",
  },
  // Player turn indicator for the bottom player (not rotated)
  player1TurnIndicator: {
    width: "100%",
    alignItems: "center",
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  // Player turn indicator for the top player (will be rotated)
  player2TurnIndicator: {
    width: "100%",
    alignItems: "center",
    paddingVertical: spacing.xs,
    marginTop: spacing.sm,
    transform: [{ rotate: "180deg" }],
  },
  turnText: {
    fontSize: 14,
    fontWeight: "600",
  },
  // For board container to give it proper spacing
  boardContainer: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
  },
});
