import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 8, // Reduziert auf 8px für mehr Platz
    marginVertical: spacing.md, // Reduziert für mehr Platz
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
    borderRadius: 14, // Moderne, leicht abgerundete Ecken
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 3,
    marginBottom: 4, // Abstand zum Label
    position: "relative", // Für das Badge
  },

  actionButtonLabel: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    textAlign: "center",
  },

  // Hinweis Counter Badge - Jetzt in Primärfarbe
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

  // Zahlen in einer Reihe - Größer und mit weniger Abstand
  numbersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 72, // Erhöht für größere Buttons
  },

  numberButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 1, // Minimaler Abstand zwischen Buttons
  },

  numberButton: {
    width: 60, // Deutlich größer
    height: 60, // Deutlich größer
    borderRadius: 12, // Moderne, leicht abgerundete Ecken
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  disabledButton: {
    opacity: 0.5,
  },

  numberButtonText: {
    fontSize: 22, // Größere Schrift für bessere Lesbarkeit
    fontWeight: "600",
  },

  disabledButtonText: {
    // Wird durch dynamische Farben gesetzt
  },

  // Animation wrapper
  animatedContainer: {
    overflow: "hidden",
  },
});
