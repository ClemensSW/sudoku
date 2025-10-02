// screens/SettingsScreen/components/AppearanceSettings/AppearanceSettings.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  settingsGroup: {
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  // Modern theme toggle
  themeToggleContainer: {
    flexDirection: "row",
    padding: 4,
    height: 56,
    width: "100%",
    overflow: "hidden",
  },
  themeOption: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  activeThemeOption: {
    backgroundColor: "transparent", // will be set dynamically
  },
  themeIcon: {
    marginRight: spacing.xs,
  },
  themeText: {
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 4,
  },
});