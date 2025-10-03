// components/GameCompletionModal/components/LevelProgress/LevelProgress.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  // Wrapper
  container: {
    width: "100%",
  },

  // ==== Card ====
  sectionCard: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
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
  levelMessage: {
    marginTop: 6,
    fontSize: 15,
    lineHeight: 21,
    opacity: 0.95,
  },

  // Gain-Chip
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

  // EP
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

  // ==== Level-Details + Titel (Accordion) ====
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

  // Aktueller Titel Zeile
  titleCurrentBlock: {
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  titleCurrentHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6, // Abstand zur Pill darunter
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

  // Titel-Auswahl (Chips)
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

  // ==== Pfad-Card Header „Deine Reise“ ====
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconWrap: {
    width: 72,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  // Trail
  trailContainer: {
    width: "100%",
    height: 120,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  trailMarker: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 3,
  },

  // Pfad-Details (Card-Button)
  pathDetailsCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  pathDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pathDetailsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  pathDetailsHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  pathColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  descriptionTitle: {
    fontSize: 15.5,
    fontWeight: "800",
  },
  descriptionBody: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 10,
    borderLeftWidth: 3,
  },
  descriptionText: {
    fontSize: 14.5,
    lineHeight: 21,
  },

  // Meilenstein
  milestoneContainer: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    position: "relative",
  },
  milestoneHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  milestoneHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  milestoneCloseButton: {
    padding: 8,
    borderRadius: 12,
  },
  milestoneTitle: {
    fontSize: 16.5,
    fontWeight: "900",
  },
  milestoneText: {
    fontSize: 14.5,
    lineHeight: 22,
  },

  // Overlay (global)
  levelUpOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.xl,
    zIndex: 20,
  },
  levelUpContent: {
    alignItems: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 2,
    maxWidth: "85%",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  levelUpText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#FFFFFF",
    marginBottom: spacing.md,
    textShadowColor: "rgba(0,0,0,0.35)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
});
