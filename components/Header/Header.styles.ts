// components/Header/Header.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    // Enhance visibility with a subtle shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    // Ensure it's positioned at the top
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
  },

  leftContainer: {
    minWidth: 40,
    alignItems: "flex-start",
  },

  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  rightContainer: {
    minWidth: 40,
    alignItems: "flex-end",
  },

  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "500",
    marginTop: spacing.xxs,
    textAlign: "center",
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});
