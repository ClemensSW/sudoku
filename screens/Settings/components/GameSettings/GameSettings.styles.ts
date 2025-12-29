// screens/SettingsScreen/components/GameSettings/GameSettings.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  settingsGroup: {
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.xxl,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  settingTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },
  settingDescription: {
    // fontSize set dynamically via theme.typography
    opacity: 0.8,
  },
});