// screens/Settings/components/AuthPromptBanner/AuthPromptBanner.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.lg,
  },

  touchable: {
    width: "100%",
  },

  container: {
    height: 120,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
    // Subtle border
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },

  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  glassOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },

  shimmer: {
    position: "absolute",
    top: 0,
    left: -150,
    width: 150,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    transform: [{ skewX: "-20deg" }],
  },

  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg + 2,
    gap: spacing.md + 4,
  },

  // Icon (Left)
  iconContainer: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBackground: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(255, 255, 255, 0.18)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    position: "relative",
    // Glow effect
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },

  cloudIconOverlay: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    // backgroundColor set inline
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.6)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  // Text (Center)
  textContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
    // Text shadow
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.90)",
    letterSpacing: 0.15,
    lineHeight: 19,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // CTA Button (Right)
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.35)",
    // Button shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    minWidth: 90,
  },

  ctaText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.4,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  ctaIcon: {
    opacity: 0.95,
  },
});

export default styles;
