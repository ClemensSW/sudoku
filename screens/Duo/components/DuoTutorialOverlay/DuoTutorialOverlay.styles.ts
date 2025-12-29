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

  // Feature cards
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
  featureIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
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

  // Progress indicator (dots under header)
  progressContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 12,
    gap: 8,
  },

  // Leagues page
  leagueIntro: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
    textAlign: "center",
  },
  ranksContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  rankIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankName: {
    flex: 1,
    fontSize: 15,
  },
  rankElo: {
    fontSize: 13,
    marginRight: 8,
  },
  currentIndicator: {
    width: 20,
    alignItems: "center",
  },

  // Current rank card
  currentRankCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  currentRankBadge: {
    marginRight: 14,
  },
  currentRankText: {
    flex: 1,
  },
  currentRankLabel: {
    fontSize: 13,
    marginBottom: 2,
  },
  currentRankValue: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 2,
  },
  pointsToNext: {
    fontSize: 13,
    marginTop: 2,
  },

  // Footer with navigation
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },

  // Dot indicators (used by progressContainer)
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  // Navigation buttons
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  backButton: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
    borderWidth: 1,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
    minHeight: 52,
    gap: 6,
  },
  nextButtonWithBack: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
