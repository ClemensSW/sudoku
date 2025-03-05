import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";
import typography from "@/utils/theme/typography";

export default StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 16,
  },

  leftContainer: {
    width: 40,
    alignItems: "flex-start",
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  rightContainer: {
    width: 40,
    alignItems: "flex-end",
  },

  title: {
    fontSize: typography.size.xl,
    fontWeight: typography.weight.semibold,
  },

  subtitle: {
    fontSize: typography.size.sm,
    fontWeight: typography.weight.regular,
    marginTop: spacing.xxs,
  },

  iconButton: {
    padding: spacing.xs,
  },
});
