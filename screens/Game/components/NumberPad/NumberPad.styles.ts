import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
  },

  // Action Buttons Row - DuoGame-Style
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginBottom: spacing.sm,
    width: "100%",
  },

  // Container für jeden ActionButton (ohne Label)
  actionButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  actionButton: {
    width: "100%",
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
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

  // Zahlen in einer Reihe - kompakter wie DuoGame
  numbersRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: 50,
  },

  // Nur der Container für den Button, keine Styles für den Button selbst
  numberButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1,
  },
});