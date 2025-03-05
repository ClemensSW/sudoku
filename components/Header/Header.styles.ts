// components/Header/Header.styles.ts
import { StyleSheet } from "react-native";

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
    fontSize: 20, // Direct value instead of typography.size.xl
    fontWeight: "600", // Direct value instead of typography.weight.semibold
  },

  subtitle: {
    fontSize: 14, // Direct value instead of typography.size.sm
    fontWeight: "normal", // Direct value instead of typography.weight.regular
    marginTop: 2, // Direct value instead of spacing.xxs
  },

  iconButton: {
    padding: 4, // Direct value instead of spacing.xs
  },
});
