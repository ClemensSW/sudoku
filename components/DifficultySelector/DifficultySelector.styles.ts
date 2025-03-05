import { StyleSheet } from "react-native";
import { spacing, typography, radius } from "@/utils/theme";

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
    ...typography.variant.body2,
    fontWeight: typography.weight.medium,
  },

  selectedButtonText: {
    // Farbe wird dynamisch gesetzt
  },
});
