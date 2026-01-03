// screens/DuoGame/components/DuoGameBoard.styles.ts
// Gap-basiertes Layout für DuoGameBoard (identisch zu Single-Player)

import { StyleSheet } from "react-native";
import { BOARD_SIZE as SHARED_BOARD_SIZE } from "@/screens/Game/components/SudokuBoard/SudokuBoard.styles";

// Board-Größe von Single-Player übernehmen
export const BOARD_SIZE = SHARED_BOARD_SIZE;
export const GRID_SIZE = BOARD_SIZE;  // Kein Rand mehr zwischen Grid und Board

// Gap-basierte Konstanten (identisch zu Single-Player)
// WICHTIG: Ganzzahlige Werte für pixelgenaues Rendering ohne Sub-Pixel-Artefakte
export const OUTER_BORDER_WIDTH = 0;  // Kein Außenrand mehr
export const BOX_GAP = 3;             // Gap zwischen 3x3 Boxen (ganzzahlig!)
export const CELL_GAP = 1;            // Gap zwischen Zellen innerhalb einer Box

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

export default StyleSheet.create({
  boardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 12,
    overflow: "visible",  // Damit Divider-Extensions nicht abgeschnitten werden
  },

  boardAnimationContainer: {
    overflow: "visible",
  },

  boardWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    // Shadow wird dynamisch gesetzt (Path Color Glow)
    shadowOffset: { width: 0, height: 6 },
  },

  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },

  // Grid-Container - backgroundColor zeigt durch die Gaps als Grid-Linien
  gridContainer: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    flexDirection: "column",
    overflow: "hidden",
    borderRadius: 16,
    // backgroundColor wird dynamisch via getGapColor gesetzt
  },

  // Container für die 3 Box-Reihen
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

  // Stepped Divider Extensions (für die stufige Trennlinie)
  dividerExtension: {
    position: "absolute",
    height: BOX_GAP,  // Gleiche Dicke wie Box-Gaps (2.5px)
    zIndex: 20,  // Über allen anderen Elementen
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 10,
    borderRadius: 16,
  },
});
