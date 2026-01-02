import { StyleSheet } from "react-native";
import { CELL_SIZE } from "@/screens/Game/components/SudokuBoard/SudokuBoard.styles";

export default StyleSheet.create({
  // Hauptcontainer für die Zelle - flex-basiert für Gap-Layout
  cellContainer: {
    flex: 1,
    aspectRatio: 1, // Garantiert quadratische Zellen
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  // Separate Layer für Hintergrund-Hervorhebungen
  // Füllt die gesamte Zelle - konsistent ohne Borders
  cellBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },

  // Inhaltscontainer für Text oder Notizen
  cellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  // Hintergrundstile für verschiedene Zustände
  selectedBackground: {
    backgroundColor: "#4A7D78",
  },

  relatedBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  errorBackground: {
    backgroundColor: "rgba(255, 70, 70, 0.3)",
  },

  hintBackground: {
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },

  successBackground: {
    backgroundColor: "rgba(120, 220, 120, 0.2)",
  },

  // Textstile
  cellText: {
    fontSize: Math.max(CELL_SIZE * 0.5, 18),
    color: "#FFFFFF",
    textAlign: "center",
  },

  initialText: {
    fontWeight: "700",
  },

  errorText: {
    color: "#FF9A9A",
  },

  sameValueText: {
    color: "#6CACA6",
    fontWeight: "700",
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
    fontSize: Math.max(CELL_SIZE * 0.2, 8),
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
