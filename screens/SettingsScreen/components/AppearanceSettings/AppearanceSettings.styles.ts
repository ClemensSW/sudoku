// screens/SettingsScreen/components/AppearanceSettings/AppearanceSettings.styles.ts
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
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
  // Spezielle Stile für die Segmentiert-Kontrolle
  segmentContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    borderRadius: 8,
    padding: 4,
    height: 40,
    width: 160,
    justifyContent: "space-between",
    alignItems: "center",
    overflow: "hidden",
  },
  segment: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    borderRadius: 6,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: "500",
  },
  activeSegment: {
    backgroundColor: "transparent", // wird im Code dynamisch gesetzt
  },
  segmentIcon: {
    marginRight: 4,
  },
});