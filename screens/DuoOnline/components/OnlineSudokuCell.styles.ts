import { StyleSheet, Dimensions } from "react-native";

// Berechnen der optimalen Cell-Größe für Online-Board
const { width } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width * 0.95, 400);
const GRID_SIZE = BOARD_SIZE * 0.95;
const GRID_BORDER_WIDTH = 1.5;
export const ONLINE_CELL_SIZE = (GRID_SIZE - 2 * GRID_BORDER_WIDTH) / 9;

export default StyleSheet.create({
  // Hauptcontainer für die Zelle
  cellContainer: {
    width: ONLINE_CELL_SIZE,
    height: ONLINE_CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative", // Wichtig für absolute Positionierung der Schichten
  },

  // Separate Layer für Hintergrund-Hervorhebungen
  cellBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  // Separate Layer für Grenzen (immer konsistent)
  cellBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    zIndex: 2,
  },

  // Inhaltscontainer für Text oder Notizen
  cellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3,
  },

  // Textstile
  cellText: {
    fontSize: Math.max(ONLINE_CELL_SIZE * 0.5, 18),
    color: "#FFFFFF",
    textAlign: "center",
  },

  // Notizen
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    padding: 1,
  },

  noteText: {
    fontSize: Math.max(ONLINE_CELL_SIZE * 0.2, 8),
    width: "33.33%",
    height: "33.33%",
    textAlign: "center",
    textAlignVertical: "center",
    color: "rgba(255, 255, 255, 0.7)",
  },

  activeNote: {
    opacity: 1,
  },

  inactiveNote: {
    opacity: 0,
  },
});
