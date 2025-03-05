import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  button: {
    height: 52,
    minWidth: 120,
    paddingHorizontal: spacing.lg,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
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
