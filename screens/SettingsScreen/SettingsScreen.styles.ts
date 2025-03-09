import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  // Sections
  section: {
    marginBottom: spacing.xl,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
    paddingHorizontal: spacing.xs,
  },

  // Settings Groups
  settingsGroup: {
    borderRadius: radius.lg,
    backgroundColor: "transparent",
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: spacing.md,
  },

  // Individual Setting Row
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
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

  // Action Buttons (for How to Play, Quit Game)
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },

  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
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

  actionDescription: {
    fontSize: 14,
    opacity: 0.8,
  },

  // Version Info
  versionContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
  },

  versionText: {
    fontSize: 14,
    opacity: 0.6,
  },

  // Specific action buttons styling
  dangerButton: {
    color: "red",
  },
});
