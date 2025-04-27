import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "108%", // Increased width to match the game board
    alignSelf: "center",
  },

  // Action Buttons Row
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginBottom: spacing.md,
    width: "100%",
  },

  // Container für jeden ActionButton und Label
  actionButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
  },

  actionButton: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 4,
    position: "relative",
  },

  actionButtonLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },

  // Hinweis Counter Badge
  hintCountBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "white",
  },

  hintCountText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },

  // Zahlen in einer Reihe - nur Container-Style
  numbersRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 70,
  },

  // Nur der Container für den Button, keine Styles für den Button selbst
  numberButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1, // Reduced padding between buttons
  },
});