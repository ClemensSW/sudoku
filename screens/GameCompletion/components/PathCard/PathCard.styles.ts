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
    flexDirection: "row",
    alignItems: "center",
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
});
