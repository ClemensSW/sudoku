import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";
import typography from "@/utils/theme/typography";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 324,
    marginVertical: spacing.md,
  },

  button: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  selectedButton: {
    // Farbe wird dynamisch gesetzt
  },

  buttonText: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.medium,
  },

  selectedButtonText: {
    // Farbe wird dynamisch gesetzt
  },
});
