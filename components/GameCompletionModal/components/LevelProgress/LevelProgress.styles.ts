// components/GameCompletionModal/components/LevelProgress/LevelProgress.styles.ts

import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  // Main container with improved styling
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    paddingBottom: spacing.lg,
    elevation: 3, // Increased elevation for better visibility
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 }, // Stronger shadow
    shadowOpacity: 0.2, // More noticeable
    shadowRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
  },
  
  // Compact container with appropriate padding
  compactContainer: {
    padding: spacing.md,
    paddingVertical: spacing.md,
  },
  
  // Redesigned XP gain badge - more prominent and eye-catching
  xpGainBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    elevation: 5, // Stand out from the background
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minWidth: 90, // Ensure consistent size
  },
  
  // Improved XP gain text styling
  xpGainText: {
    color: "#FFFFFF",
    fontSize: 16, // Larger for better visibility
    fontWeight: "800",
    marginLeft: spacing.xs,
    letterSpacing: 0.5, // Subtle letter spacing for emphasis
  },
  
  // Header with level badge and info
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  
  // Level information container
  levelInfoContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  
  // Level name with improved typography
  levelName: {
    fontSize: 20, // Larger
    fontWeight: "800", // Bolder
    marginBottom: spacing.xxs,
    letterSpacing: 0.3, // Subtle enhancement
    lineHeight: 24, // Verbesserte Zeilenhöhe
  },
  
  // Level description styling
  levelMessage: {
    fontSize: 15, // Slightly larger for readability
    lineHeight: 20,
    opacity: 0.9, // Slightly increased opacity
  },
  
  // Path info container with better spacing
  pathInfoContainer: {
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1, // Visual separator
  },
  
  // Pfad-Überschrift mit Pfeil
  pathHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  
  // Pfad-Inhalt (wenn ausgeklappt)
  pathContent: {
    marginTop: 8,
    padding: 12, 
    borderRadius: 8,
    borderLeftWidth: 3,
  },
  
  // Progress section styling
  progressSection: {
    marginTop: spacing.xs,
  },
  
  // XP info row with better layout
  xpInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  
  // XP text styling
  xpText: {
    fontSize: 18, // Larger
    fontWeight: "700", // Bolder
    letterSpacing: 0.5, // Subtle enhancement
  },
  
  // XP label styling
  xpLabel: {
    fontWeight: "500",
    fontSize: 15,
  },
  
  // Text for remaining XP to next level
  xpToGo: {
    fontSize: 14,
    opacity: 0.85, // Slightly more visible
    fontWeight: "500", // Medium weight for better visibility
  },
  
  // Progress bar container
  progressBarContainer: {
    height: 10, // Taller for better visibility
    width: "100%",
    borderRadius: radius.md,
    overflow: "hidden",
  },
  
  // Progress bar background
  progressBackground: {
    width: "100%",
    height: "100%",
    borderRadius: radius.md,
    overflow: "hidden",
  },
  
  // Progress bar fill
  progressFill: {
    height: "100%",
    borderRadius: radius.md,
  },
  
  // NEU: Meilenstein container
  milestoneContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    elevation: 0,
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  
  // NEU: Schließen-Button für Meilenstein
  milestoneCloseButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  
  // NEU: Meilenstein Icon Container
  milestoneIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  
  // NEU: Meilenstein Titel
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  
  // NEU: Meilenstein Text
  milestoneText: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Level up overlay - enhanced for impact
  levelUpOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: radius.xl,
    zIndex: 20, // Ensure it's on top
  },
  
  // Level up content with enhanced design
  levelUpContent: {
    alignItems: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 2,
    maxWidth: "85%", // Limit width for better proportion
    backgroundColor: "rgba(0,0,0,0.7)", // Darker background for contrast
  },
  
  // "LEVEL UP!" text with dramatic styling
  levelUpText: {
    fontSize: 28,
    fontWeight: "900", // Extra bold
    color: "#FFFFFF",
    marginBottom: spacing.md,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    letterSpacing: 1.5, // Dramatic letter spacing for impact
    textTransform: "uppercase", // All caps for emphasis
  },
  
 
  
  
  
  // Celebration effect container
  celebrationContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 15,
    pointerEvents: "none",
  },
  
  // New styles for text readability
  textContainer: {
    marginVertical: 4,
  },
  
  // Text with background for better contrast
  textWithBackground: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  
  // Container for toggle button and heading
  headerWithToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  
  // Toggle button
  toggleButton: {
    padding: 4,
    borderRadius: 12,
  },
  
  // High contrast text styles
  highContrastLight: {
    color: '#000000',
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  
  highContrastDark: {
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  
  // Level up text with higher contrast
  levelUpTextHighContrast: {
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
});