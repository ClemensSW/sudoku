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
    paddingHorizontal: spacing.md,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },
});