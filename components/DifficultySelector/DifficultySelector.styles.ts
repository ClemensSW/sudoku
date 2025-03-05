// components/DifficultySelector/DifficultySelector.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 324,
    marginVertical: 16, // Direct value instead of spacing.md
  },

  button: {
    paddingVertical: 4, // Direct value instead of spacing.xs
    paddingHorizontal: 8, // Direct value instead of spacing.sm
    borderRadius: 8, // Direct value
    borderWidth: 1,
  },

  selectedButton: {
    // Farbe wird dynamisch gesetzt
  },

  buttonText: {
    fontSize: 14, // Direct value instead of typography.size.sm
    fontWeight: "500", // Direct value instead of typography.weight.medium
  },

  selectedButtonText: {
    // Farbe wird dynamisch gesetzt
  },
});
