import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
  },

  // Action Buttons Row - Pill-Shape Style
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: spacing.sm,
    width: "100%",
  },

  // Container für jeden ActionButton mit Label
  actionButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  // Label unterhalb des Buttons
  actionButtonLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
    textAlign: "center",
  },

  actionButton: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    position: "relative",
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

  // Minimalistisches Zahlen-Layout
  numbersRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingVertical: spacing.sm,
  },

  // Container für jede Zahl - FESTE GRÖSSE verhindert Verschiebung
  numberItem: {
    width: 36,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  // Pressable-Bereich für Touch-Feedback
  numberPressable: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  // Minimalistischer Zahlen-Text
  numberText: {
    fontSize: 32,
    fontWeight: "500",
    // color wird dynamisch mit pathColorHex gesetzt
  },
});