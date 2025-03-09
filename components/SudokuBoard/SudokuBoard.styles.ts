import { StyleSheet, Dimensions } from "react-native";

// Berechnen der optimalen Board-Größe basierend auf Bildschirmbreite
const { width } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width * 0.9, 400); // 90% der Bildschirmbreite, maximal 400px
const GRID_SIZE = BOARD_SIZE * 0.95; // Etwas kleiner als das Board für Padding
const CELL_SIZE = GRID_SIZE / 9; // Gleichmäßige Zellgröße

export default StyleSheet.create({
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 24,
    paddingHorizontal: 24,
  },

  boardAnimationContainer: {
    overflow: "visible",
  },

  boardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },

  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0,
  },

  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "column",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
    overflow: "hidden",
    borderRadius: 8,
  },

  row: {
    flexDirection: "row",
    height: CELL_SIZE,
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});
