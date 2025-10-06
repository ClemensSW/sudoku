import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  // Main Card - konsistent mit LevelCard/PathCard
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: 0, // Sections handle their own padding
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

  badge: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Puzzle Section - luftig
  puzzleSection: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
  },

  puzzleContainer: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
  },

  puzzleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  // Grid Overlay
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 3,
  },

  segment: {
    width: "33.33%",
    height: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
  },

  segmentInner: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },

  unlockedSegment: {
    // Transparent - shows image
  },

  lockedSegment: {
    borderWidth: 1.5,
  },

  newlyUnlockedSegment: {
    borderWidth: 2.5,
  },

  // Completion Glow
  completionGlow: {
    position: "absolute",
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    borderWidth: 3,
  },

  // Progress Section
  progressSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
  },

  progressText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: spacing.md,
  },

  progressBarContainer: {
    width: "100%",
    height: 16,
    borderRadius: 8,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 8,
  },

  // Action Section
  actionSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Celebration Overlay
  celebrationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },

  completionText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});