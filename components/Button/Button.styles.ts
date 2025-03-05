import { StyleSheet } from "react-native";
import typography from "@/utils/theme/typography";
import shadows from "@/utils/theme/shadows";

export default StyleSheet.create({
  button: {
    height: 48,
    minWidth: 120,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    ...shadows.sm,
  },

  buttonText: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.semibold,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: typography.letterSpacing.wide,
    textAlign: "center",
  },
});
