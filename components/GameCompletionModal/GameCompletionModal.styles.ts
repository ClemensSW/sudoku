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

  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 160,
    borderTopLeftRadius: 0, // Removed radius for fullscreen
    borderTopRightRadius: 0, // Removed radius for fullscreen
  },

  titleContainer: {
    width: "100%",
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    zIndex: 2,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: spacing.xs,
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  subtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },

  difficultyBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs,
    borderRadius: 20,
    marginTop: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
  },

  difficultyText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFF",
  },

  scrollContainer: {
    width: "100%",
    padding: spacing.lg,
    paddingBottom: 260, // Significantly increased padding to create more scrollable space at the bottom
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
    backgroundColor: "rgba(0,0,0,0.7)",
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
    height: spacing.md,
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