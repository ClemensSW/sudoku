// components/GameCompletion/components/PathCard/PathCard.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  // Main Card - identisch zu LevelCard
  card: {
    width: "100%",
    borderRadius: radius.xl,
    padding: 0, // Content sections handle their own padding
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  // Header Section - minimalistisch
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },

  headerLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },

  // Trail Section - luftig
  trailSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
  },

  // Path Details Section
  pathSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  pathPressable: {
    borderRadius: 12,
    padding: spacing.md,
  },

  pathHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },

  pathHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  pathLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },

  pathName: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },

  // Description Wrapper (mit Fade-Gradient)
  pathDescriptionWrapper: {
    position: "relative",
    marginTop: spacing.md,
  },

  pathDescription: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.8,
    fontWeight: "500",
  },

  descriptionFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },

  // Rewards Placeholder (für Zukunft)
  rewardsPlaceholder: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    alignItems: "center",
  },

  comingSoonText: {
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.5,
    fontStyle: "italic",
  },
});
