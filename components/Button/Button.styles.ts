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
    alignSelf: "stretch", // Nimmt volle Breite des Parents wenn möglich
  },

  buttonText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    letterSpacing: 0.3,
    textAlign: "center",
  },

  // Animation container
  animatedContainer: {
    overflow: "hidden",
    alignSelf: "stretch", // Nimmt volle Breite des Parents
  },

  // Icon styling
  iconLeft: {
    marginRight: spacing.xs,
  },

  iconRight: {
    marginLeft: spacing.xs,
  },
});