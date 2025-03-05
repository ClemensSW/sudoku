import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  cell: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
  },

  // Gitter-Styling
  bottomBorder: {
    borderBottomWidth: 1.5,
  },

  rightBorder: {
    borderRightWidth: 1.5,
  },

  // Cell state styling
  selectedCell: {
    // Handled with dynamic colors
  },

  relatedCell: {
    // Handled with dynamic colors
  },

  sameValueCell: {
    // Handled with dynamic colors
  },

  initialCell: {
    // Handled with dynamic colors
  },

  errorCell: {
    // Handled with dynamic colors
  },

  hintCell: {
    // Handled with dynamic colors
  },

  successCell: {
    // Handled with dynamic colors
  },

  // Text-Styling
  cellText: {
    fontSize: 20,
    fontWeight: "400",
  },

  selectedCellText: {
    // Handled with dynamic colors
  },

  initialCellText: {
    fontWeight: "700",
  },

  errorCellText: {
    // Handled with dynamic colors
  },

  // Notes grid styling
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    padding: 2,
  },

  noteText: {
    fontSize: 9,
    width: "33%",
    height: "33%",
    textAlign: "center",
    textAlignVertical: "center",
  },

  activeNote: {
    opacity: 1,
  },

  inactiveNote: {
    opacity: 0,
  },

  // Cell content
  cellValue: {
    textAlign: "center",
  },

  // Animation container for cell
  cellContainer: {
    overflow: "hidden",
  },
});
