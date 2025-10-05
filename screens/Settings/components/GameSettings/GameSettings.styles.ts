// screens/SettingsScreen/components/GameSettings/GameSettings.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  settingsGroup: {
    borderRadius: 12,
    backgroundColor: "transparent",
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    marginRight: spacing.md,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },
  settingDescription: {
    fontSize: 14,
    opacity: 0.8,
  },
});