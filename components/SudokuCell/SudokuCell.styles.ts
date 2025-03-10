import { StyleSheet, Dimensions } from "react-native";

// Verwende dieselbe Berechnung wie im Board
const { width } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width * 0.9, 400);
const GRID_SIZE = BOARD_SIZE * 0.95;
const CELL_SIZE = GRID_SIZE / 9;

// Dynamische Schriftgrößen basierend auf der Zellgröße
const FONT_SIZE = Math.max(CELL_SIZE * 0.55, 16); // Mindestens 16px groß
const NOTE_FONT_SIZE = Math.max(CELL_SIZE * 0.25, 8); // Mindestens 8px groß

export default StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5, // Dünnere normalen Grenzen für besseren Kontrast zu Blockgrenzen
    borderColor: "rgba(255, 255, 255, 0.2)", // Subtilere Farbe für normale Zellgrenzen
    backgroundColor: "transparent",
    zIndex: 1, // Niedrigerer z-index als die Blockgrenzen
  },

  // Zellzustände mit deutlicheren visuellen Unterschieden
  selectedCell: {
    backgroundColor: "rgba(255, 255, 255, 0.4)", // Stärkerer Kontrast für ausgewählte Zelle
  },

  relatedCell: {
    backgroundColor: "rgba(255, 255, 255, 0.15)", // Subtiler Kontrast für Zeile/Spalte/Box
  },

  sameValueCell: {
    // Kein Hintergrund für Zellen mit gleichen Werten
    backgroundColor: "transparent",
  },

  // Neuer Style für Text in Zellen mit gleichem Wert
  sameValueText: {
    color: "rgba(130, 210, 255, 1)", // Helles Blau, das zum Design passt
    fontWeight: "700",
  },

  errorCell: {
    backgroundColor: "rgba(255, 100, 100, 0.35)", // Deutlicheres Rot
  },

  hintCell: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },

  successCell: {
    backgroundColor: "rgba(152, 255, 152, 0.3)", // Leicht grünlich für Erfolg
  },

  // Textstile
  cellText: {
    fontSize: FONT_SIZE,
    color: "#FFFFFF",
    textAlign: "center",
  },

  initialText: {
    fontWeight: "700",
  },

  errorText: {
    color: "#FFC0C0", // Helleres Rot für bessere Lesbarkeit
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
    fontSize: NOTE_FONT_SIZE,
    width: "33.33%",
    height: "33.33%",
    textAlign: "center",
    textAlignVertical: "center",
    color: "rgba(255, 255, 255, 0.85)", // Erhöhter Kontrast für bessere Lesbarkeit
  },

  activeNote: {
    opacity: 1,
  },

  inactiveNote: {
    opacity: 0,
  },

  // Animations-Container
  cellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});
