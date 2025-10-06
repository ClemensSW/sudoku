// components/GameCompletion/components/LevelCard/LevelCard.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  // Main Card
  card: {
    width: "100%",
    borderRadius: radius.xl,
    padding: 0, // Remove padding, content sections handle their own
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    overflow: "visible", // Allow badge to scale beyond card bounds
  },

  // Hero Header Container (centered badge + title)
  heroHeader: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    position: "relative",
    overflow: "visible", // Allow badge to scale beyond bounds
  },

  // Badge Container (with glow)
  badgeContainer: {
    marginBottom: spacing.md,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999, // Above all content during animation
  },

  badgeGlow: {
    position: "absolute",
    width: 200, // Large enough for 2.5x scale
    height: 200,
    borderRadius: 100,
    opacity: 0.35,
  },

  // Title Text
  levelTitle: {
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
    textAlign: "center",
    marginTop: spacing.sm,
  },

  levelSubtitle: {
    fontSize: 14,
    fontWeight: "600",
    opacity: 0.75,
    textAlign: "center",
    marginTop: 4,
  },

  // Header (Badge + Text) - Legacy support
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  levelInfoContainer: {
    flex: 1,
    marginLeft: spacing.lg,
  },

  levelName: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 0.3,
    lineHeight: 24,
  },

  // XP Gain Badge - Vertical Stack (kein Icon)
  xpGainBadge: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    gap: 2,
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    minWidth: 70,
  },

  xpGainNumber: {
    fontSize: 20,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },

  xpGainLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255, 255, 255, 0.9)",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },

  // Progress Section
  progressSection: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    borderBottomWidth: 1,
  },

  // Progress Header with XP values
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  xpValueText: {
    fontSize: 15,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
    letterSpacing: 0.3,
  },

  // Progress Bar Row (Bar + Badge inline)
  progressBarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.sm,
  },

  progressBarContainer: {
    flex: 1,
    height: 16,
    borderRadius: 8,
    overflow: "hidden",
  },

  progressBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
  },

  // Shimmer effect for progress bar
  progressShimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "30%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },

  // Next Level Preview Card - Neutral mit Akzent
  nextLevelCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderLeftWidth: 3,
  },

  nextLevelHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.xs,
  },

  nextLevelHeaderText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.8,
  },

  nextLevelTitle: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: 4,
  },

  nextLevelXp: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.75,
  },

  // Title Section - Full Width & Fully Tappable
  titleSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  titlePressable: {
    borderRadius: 12,
    padding: spacing.md,
  },

  titleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xs,
  },

  titleHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  titleLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    opacity: 0.7,
  },

  titleValue: {
    fontSize: 17,
    fontWeight: "800",
    letterSpacing: 0.3,
    marginBottom: spacing.xs,
  },

  // Title Description (3 lines max with fade)
  titleDescriptionWrapper: {
    position: "relative",
    marginTop: spacing.xs,
  },

  titleDescription: {
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

  // Level Details Card (Accordion) - Legacy
  levelDetailsCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    marginTop: spacing.md,
  },

  levelDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  levelDetailsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  levelColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  levelDetailsTitle: {
    fontSize: 15.5,
    fontWeight: "800",
  },

  levelDescriptionBody: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 10,
    borderLeftWidth: 3,
  },

  levelMessage: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
    opacity: 0.95,
  },

  // Current Title Block
  titleCurrentBlock: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },

  titleCurrentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  titleCurrentText: {
    fontSize: 14.5,
    fontWeight: "700",
  },

  titlePill: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    maxWidth: "100%",
  },

  titlePillText: {
    fontSize: 12.5,
    fontWeight: "800",
  },

  // Title Selection (Chips)
  titleHeaderRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  titleHeaderLabel: {
    fontSize: 13.5,
    fontWeight: "800",
    opacity: 0.9,
  },

  titleClearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
  },

  titleClearText: {
    fontSize: 12.5,
    fontWeight: "700",
    opacity: 0.9,
  },

  titleChipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },

  titleChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
    maxWidth: "100%",
  },

  titleChipText: {
    fontSize: 13,
    fontWeight: "800",
    maxWidth: 200,
  },
});
