import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "transparent",
    paddingVertical: spacing.xs,
    borderRadius: spacing.md,
  },
});
