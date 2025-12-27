// screens/Duo/components/DuoTutorialOverlay/DuoTutorialOverlay.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

const styles = StyleSheet.create({
  // Fullscreen overlay
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    zIndex: 1000,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  headerSpacer: {
    width: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },

  // Content
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },

  // Feature cards (same as DuoFeatures)
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Footer with button
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  understoodButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    minHeight: 52,
  },
  understoodButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
