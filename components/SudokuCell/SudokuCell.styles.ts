// components/SudokuCell/SudokuCell.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";
import typography from "@/utils/theme/typography";

export default StyleSheet.create({
  cell: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, // Direct value instead of spacing.xxs / 2
    borderColor: "#ccc",
  },

  // Gitter-Styling
  bottomBorder: {
    borderBottomWidth: 2, // Direct value instead of spacing.xxs
    borderBottomColor: "#000",
  },
  rightBorder: {
    borderRightWidth: 2, // Direct value instead of spacing.xxs
    borderRightColor: "#000",
  },

  // Zellen-Status-Styling
  selectedCell: {
    // Farbe wird dynamisch gesetzt
  },
  relatedCell: {
    // Farbe wird dynamisch gesetzt
  },
  sameValueCell: {
    // Farbe wird dynamisch gesetzt
  },
  initialCell: {
    // Farbe wird dynamisch gesetzt
  },
  errorCell: {
    // Farbe wird dynamisch gesetzt
  },
  hintCell: {
    // Farbe wird dynamisch gesetzt
  },
  successCell: {
    // Farbe wird dynamisch gesetzt
  },

  // Text-Styling
  cellText: {
    fontSize: typography.size.lg,
  },
  selectedCellText: {
    // Farbe wird dynamisch gesetzt
  },
  initialCellText: {
    fontWeight: typography.weight.bold,
  },
  errorCellText: {
    // Farbe wird dynamisch gesetzt
  },

  // Notiz-Styling
  notesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    padding: 1, // Direct value instead of spacing.xxs / 2
  },
  noteText: {
    fontSize: typography.size.xs / 1.3,
    width: "33%",
    height: "33%",
    textAlign: "center",
  },
  activeNote: {
    opacity: 1,
  },
  inactiveNote: {
    opacity: 0,
  },

  // Cell content
  cellValue: {
    fontSize: typography.size.lg,
    textAlign: "center",
  },
});
