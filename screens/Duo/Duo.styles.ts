// screens/Duo/Duo.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    // Components handle their own horizontal margins
  },

  // Action buttons row (Lokal/Online spielen)
  actionButtonsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 0,
    marginBottom: 20,
    paddingHorizontal: 20,
  },

  // Individual action button
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 18,
    paddingHorizontal: 20,
    minHeight: 60,
    // Shadow
    elevation: 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  // Action button text
  actionButtonText: {
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
  },

  // Coming Soon Badge on disabled button
  comingSoonBadge: {
    position: "absolute",
    top: -8,
    right: -4,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },

  comingSoonText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Game Mode Cards Section (legacy)
  gameModeSection: {
    paddingHorizontal: 20,
    marginTop: 8,
    marginBottom: 8,
    gap: 12,
  },

  // Scroll Indicator Wrapper
  scrollIndicatorWrapper: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: "center",
  },

  // Features Section
  featuresSection: {
    marginTop: spacing.md,
    paddingHorizontal: 20,
  },
});
