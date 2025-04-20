import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginVertical: spacing.md,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: "hidden",
  },
  
  // Header-Bereich
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  
  newSegmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.md,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
  newSegmentText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  
  // Bildvorschau und Raster
  puzzleContainer: {
    width: "100%",
    aspectRatio: 1, // Quadratisches Format für das Puzzle
    marginBottom: spacing.md,
    borderRadius: radius.md,
    overflow: "hidden",
    position: "relative",
  },
  
  puzzleImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  
  // Raster-Overlay
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  
  segment: {
    width: "33.33%",
    height: "33.33%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  
  unlockedSegment: {
    // Keine zusätzlichen Styles für freigeschaltete Segmente
  },
  
  lockedSegment: {
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(18,18,18, 0.95)",
  },
  
  // Highlight für das neueste Segment
  newlyUnlockedSegment: {
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    backgroundColor: "rgba(74, 125, 120, 0.3)", // Primärfarbe mit Transparenz
  },
  
  // Fortschrittsanzeige
  progressTextContainer: {
    alignItems: "center",
    marginVertical: spacing.sm,
  },
  
  progressText: {
    fontSize: 14,
    fontWeight: "500",
  },
  
  progressBar: {
    width: "100%",
    height: 6,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    borderRadius: 3,
    marginTop: spacing.sm,
    overflow: "hidden",
  },
  
  progressFill: {
    height: "100%",
    borderRadius: 3,
  },
  
  // Button-Bereich
  buttonContainer: {
    marginTop: spacing.md,
  },
  
  // Celebration Overlay für abgeschlossene Bilder
  celebrationOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.md,
  },
  
  completionText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});