// components/GameCompletion/components/LevelCard/LevelCard.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  // Main Card
  card: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  // Header (Badge + Text)
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

  // Gain Chip
  gainChip: {
    marginTop: 12,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
  },

  gainChipText: {
    fontWeight: "800",
    fontSize: 13,
    letterSpacing: 0.2,
  },

  // Progress Section
  progressSection: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },

  xpInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },

  xpText: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  xpToGo: {
    fontSize: 14,
    opacity: 0.95,
    fontWeight: "500",
  },

  progressBarContainer: {
    height: 12,
    width: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
  },

  progressBackground: {
    width: "100%",
    height: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: radius.lg,
  },

  // Level Details Card (Accordion)
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
