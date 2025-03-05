// components/SudokuBoard/SudokuBoard.styles.ts
import { StyleSheet } from "react-native";
import shadows from "@/utils/theme/shadows";

export default StyleSheet.create({
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16, // Direct value instead of spacing.md
  },
  board: {
    width: 324, // 9 cells * 36px per cell
    height: 324,
    borderWidth: 2, // Direct value instead of spacing.xxs
    borderColor: "#000",
    ...shadows.md,
  },
  row: {
    flexDirection: "row",
    height: 36,
  },
});
