import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    zIndex: 9999,
  },
  
  modalContainer: {
    width: "100%", // Changed to full width
    height: "100%", // Changed to full height
    borderRadius: 0, // Removed border radius for fullscreen
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 25,
  },

  // Hero Header Styles (inside ScrollView)
  heroHeaderInScroll: {
    width: "100%",
    overflow: "hidden",
    marginBottom: 0, // No margin - cards will have their own spacing
  },

  heroGradient: {
    width: "100%",
    paddingTop: spacing.xl * 2.5, // Extra top padding for status bar area
    paddingBottom: spacing.xl * 1.5,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    borderRadius: 0, // No border radius - full width
  },

  heroIconWrapper: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg,
  },

  iconGlow: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.6,
  },

  iconGlowOuter: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.3,
  },

  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: 0.5,
    textAlign: "center",
    marginBottom: spacing.xs,
  },

  heroSubtitle: {
    fontSize: 16,
    fontWeight: "500",
    letterSpacing: 0.3,
    textAlign: "center",
    opacity: 0.9,
  },

  recordFloatingBadge: {
    marginTop: spacing.lg,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#FBBC05",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },

  recordGradient: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  recordFloatingText: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  scrollContainer: {
    width: "100%",
    paddingTop: 0, // No top padding - header starts at display top
    paddingHorizontal: 0, // No horizontal padding for header
    paddingBottom: 260, // Significantly increased padding to create more scrollable space at the bottom
  },

  cardsContainer: {
    paddingHorizontal: spacing.lg, // 24px horizontal padding for cards
    paddingTop: spacing.xl, // Spacing between header and first card
  },

  // Bottom fixed button container
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: Math.max(spacing.lg, spacing.md + 30), // Extra padding for bottom safety
    backgroundColor: "rgba(0,0,0,1)",
    borderBottomLeftRadius: 0, // Removed radius for fullscreen
    borderBottomRightRadius: 0, // Removed radius for fullscreen
    backdropFilter: "blur(10px)",
  },

  primaryButton: {
    width: "100%",
    marginBottom: spacing.md,
    height: 56,
  },

  secondaryButton: {
    width: "100%",
    height: 48,
    borderRadius: 24,
  },

  sectionSpacer: {
    height: spacing.lg, // 24px - spacing between cards
  },

  // Separator between sections
  separator: {
    width: "100%",
    height: 1,
    marginVertical: spacing.lg,
    opacity: 0.15,
  },

  // Optional: Scrollbar styling if we need it
  scrollbar: {
    width: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});