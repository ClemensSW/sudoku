import { StyleSheet } from "react-native";
import { shadows, spacing } from "@/utils/theme";

export default StyleSheet.create({
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
  },
  board: {
    width: 324, // 9 cells * 36px per cell
    height: 324,
    borderWidth: spacing.xxs,
    borderColor: "#000",
    ...shadows.md,
  },
  row: {
    flexDirection: "row",
    height: 36,
  },
});
