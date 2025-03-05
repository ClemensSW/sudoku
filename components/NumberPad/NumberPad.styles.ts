import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";
import typography from "@/utils/theme/typography";
import shadows from "@/utils/theme/shadows";

export default StyleSheet.create({
  container: {
    width: 324,
    marginTop: spacing.xl,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.sm,
  },

  activeActionButton: {
    // Farbe wird dynamisch gesetzt
  },

  numbersContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  button: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24,
    marginBottom: 8,
    ...shadows.sm,
  },

  disabledButton: {
    opacity: 0.5,
  },

  buttonText: {
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.medium,
  },

  disabledButtonText: {
    // Farbe wird dynamisch gesetzt
  },
});
