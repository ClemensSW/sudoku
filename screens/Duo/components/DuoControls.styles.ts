// screens/DuoScreen/components/DuoControls.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: spacing.md,
  },
  divider: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: spacing.md,
  },
  playerControls: {
    width: "100%",
    alignItems: "center",
  },
  player1Controls: {
    marginBottom: spacing.xl,
  },
  player2Controls: {
    marginTop: spacing.lg,
  },
  rotatedControls: {
    transform: [{ rotate: "180deg" }],
    width: "100%",
  },
  playerLabel: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: spacing.sm,
    marginVertical: spacing.md,
    alignSelf: "center",
  },
  playerLabelText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  playerTurnIndicator: {
    padding: spacing.xs,
    borderRadius: spacing.md,
    marginBottom: spacing.xs,
    alignSelf: "center",
  },
  activePlayer: {
    backgroundColor: "rgba(76, 175, 80, 0.2)", // Green for active player
  },
  inactivePlayer: {
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  turnText: {
    fontWeight: "700",
    fontSize: 14,
  },
  // Styles for the number pad container
  numberPadContainer: {
    width: "100%",
    paddingHorizontal: 8,
    marginTop: spacing.md,
  },
  // Number button row
  numbersRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 60,
  },
  // Number button container
  numberButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  // Button styling
  numberButton: {
    width: "100%",
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4361EE",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  disabledButton: {
    opacity: 0.5,
  },
});