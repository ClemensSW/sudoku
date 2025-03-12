import { StyleSheet, Dimensions } from "react-native";

// Berechnen der optimalen Board-Größe basierend auf Bildschirmbreite
const { width } = Dimensions.get("window");
export const BOARD_SIZE = Math.min(width * 0.9, 400); // 90% der Bildschirmbreite, maximal 400px
export const GRID_SIZE = BOARD_SIZE * 0.95; // Etwas kleiner als das Board für Padding
export const CELL_SIZE = GRID_SIZE / 9; // Gleichmäßige Zellgröße

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
    // Äußerer Schatten beibehalten, aber subtiler
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
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
    borderWidth: 2.5,
    borderColor: "#FFFFFF", // Vollständig weiße Außengrenze
    overflow: "hidden",
    borderRadius: 8,
    // Entferne den inneren Schatten
  },

  // Stil für Gridlinien
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    zIndex: 5, // Höherer z-index als Zellen
  },

  // Horizontale Linien zwischen den 3x3-Blöcken
  horizontalGridLine: {
    width: GRID_SIZE,
    height: 2.5,
    left: 0,
  },

  // Vertikale Linien zwischen den 3x3-Blöcken
  verticalGridLine: {
    width: 2.5,
    height: GRID_SIZE,
    top: 0,
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
