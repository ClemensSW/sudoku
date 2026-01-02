import { StyleSheet, Dimensions } from "react-native";

// Berechnen der optimalen Board-Größe basierend auf Bildschirmbreite
const { width } = Dimensions.get("window");
export const BOARD_SIZE = Math.min(width * 0.95, 400);
export const GRID_SIZE = BOARD_SIZE * 0.95;

// Gap-basierte Konstanten (ersetzen Borders)
export const OUTER_BORDER_WIDTH = 1.5;  // Außenrand des Grids (bleibt als echter Border)
export const BOX_GAP = 2.5;             // Gap zwischen 3x3 Boxen
export const CELL_GAP = 0.5;            // Gap zwischen Zellen innerhalb einer Box

// Verfügbarer Innenraum nach Abzug des Außenrands
const INNER_GRID_SIZE = GRID_SIZE - 2 * OUTER_BORDER_WIDTH;

// Gesamter Gap-Raum:
// - 2 BOX_GAPs (zwischen 3 Boxen horizontal/vertikal)
// - 6 CELL_GAPs (2 Gaps pro Box × 3 Boxen)
const TOTAL_GAP_SPACE = 2 * BOX_GAP + 6 * CELL_GAP;
const AVAILABLE_CELL_SPACE = INNER_GRID_SIZE - TOTAL_GAP_SPACE;

// Jede der 9 Zellen bekommt gleichen Anteil
export const CELL_SIZE = AVAILABLE_CELL_SPACE / 9;

// Box-Größe = 3 Zellen + 2 Cell-Gaps
export const BOX_SIZE = 3 * CELL_SIZE + 2 * CELL_GAP;

// Backward-Compatibility Aliases (deprecated)
export const BOX_BORDER_WIDTH = BOX_GAP;
export const CELL_BORDER_WIDTH = CELL_GAP;

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
    backgroundColor: "#1E2233",
    borderWidth: 0,
  },

  // Grid-Container mit Außenrand
  // backgroundColor zeigt durch die Gaps als Grid-Linien
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "column",
    borderWidth: OUTER_BORDER_WIDTH,
    borderColor: "rgba(255, 255, 255, 0.25)",
    overflow: "hidden",
    borderRadius: 8,
    // backgroundColor wird dynamisch via Theme gesetzt
  },

  // Container für die 3 Box-Reihen
  // Gap erzeugt dicke Linien zwischen Boxen
  boxesContainer: {
    flex: 1,
    flexDirection: "column",
    gap: BOX_GAP,
  },

  // Reihe von 3 Boxen
  boxRow: {
    flexDirection: "row",
    flex: 1,
    gap: BOX_GAP,
  },

  // Einzelne Box - keine Borders, nur Gap zwischen Zellen
  box: {
    flexDirection: "column",
    flex: 1,
    gap: CELL_GAP,
    backgroundColor: "transparent",
  },

  // Reihe von 3 Zellen innerhalb einer Box
  cellRow: {
    flexDirection: "row",
    flex: 1,
    gap: CELL_GAP,
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
