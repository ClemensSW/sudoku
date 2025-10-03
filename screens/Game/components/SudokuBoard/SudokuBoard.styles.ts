import { StyleSheet, Dimensions } from "react-native";

// Berechnen der optimalen Board-Größe basierend auf Bildschirmbreite
const { width } = Dimensions.get("window");
export const BOARD_SIZE = Math.min(width * 0.95, 400);
export const GRID_SIZE = BOARD_SIZE * 0.95;
// gridContainer hat borderWidth 1.5, der Border wird nach innen gezeichnet
// Verfügbarer Innenraum = GRID_SIZE - (2 × 1.5) = GRID_SIZE - 3
const GRID_BORDER_WIDTH = 1.5;
export const CELL_SIZE = (GRID_SIZE - 2 * GRID_BORDER_WIDTH) / 9;

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
    // Subtiler Schatten
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
    backgroundColor: "#1E2233", // Dunklerer, eher anthrazitfarbener Hintergrund mit leichtem Blauton
    borderWidth: 0,
  },

  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "column",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.25)", // Subtilere Außenränder
    overflow: "hidden",
    borderRadius: 8,
  },

  // Stil für Gridlinien
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.2)", // Subtilere Linien
    zIndex: 5,
  },

  // Horizontale Linien zwischen den 3x3-Blöcken
  horizontalGridLine: {
    width: GRID_SIZE,
    height: 1.5, // Dünner
    left: 0,
  },

  // Vertikale Linien zwischen den 3x3-Blöcken
  verticalGridLine: {
    width: 1.5, // Dünner
    height: GRID_SIZE,
    top: 0,
  },

  row: {
    flexDirection: "row",
    height: CELL_SIZE,
  },

  // Loading overlay
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
});
