// components/Button/Button.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  button: {
    height: 56,
    minWidth: 120,
    paddingHorizontal: spacing.xl,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
    textAlign: "center",
  },

  // Animation container
  animatedContainer: {
    overflow: "hidden",
  },

  // Icon styling
  iconLeft: {
    marginRight: spacing.xs,
  },

  iconRight: {
    marginLeft: spacing.xs,
  },
});