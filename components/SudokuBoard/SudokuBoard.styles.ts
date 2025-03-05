import { StyleSheet } from "react-native";
import shadows from "@/utils/theme/shadows";

export default StyleSheet.create({
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  board: {
    width: 324, // 9 cells * 36px per cell
    height: 324,
    borderWidth: 2,
    borderColor: "#000",
    ...shadows.md,
  },
  row: {
    flexDirection: "row",
    height: 36,
  },
});
