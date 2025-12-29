// screens/SettingsScreen/components/ActionsSection/ActionsSection.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  settingsGroup: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
  },
  actionIcon: {
    width: 48,
    height: 48,
    marginRight: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },
  separator: {
    height: 1,
  },
});