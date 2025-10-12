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
    minHeight: 220,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    // Premium shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 12,
    // Subtle border for definition
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.18)",
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
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  shimmer: {
    position: "absolute",
    top: 0,
    left: -100,
    width: 120,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.35)",
    transform: [{ skewX: "-20deg" }],
  },

  content: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.lg + 6,
    paddingHorizontal: spacing.lg + 4,
    gap: spacing.md + 2,
  },

  iconContainer: {
    width: 64,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
  },

  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.22)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.35)",
    position: "relative",
    // Inner glow
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },

  cloudIconOverlay: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    // backgroundColor set inline based on progressColor
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.5)",
  },

  textContainer: {
    flex: 1,
    gap: spacing.xs + 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
    marginBottom: 3,
    // Text shadow for readability on gradient
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },

  subtitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.92)",
    letterSpacing: 0.1,
    lineHeight: 18,
    marginBottom: spacing.xs + 3,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  benefitsList: {
    gap: 6,
  },

  benefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
  },

  benefitIcon: {
    opacity: 0.9,
    flexShrink: 0,
    marginTop: 1,
  },

  benefitText: {
    fontSize: 11.5,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.88)",
    letterSpacing: 0.1,
    lineHeight: 16,
    flex: 1,
    textShadowColor: "rgba(0, 0, 0, 0.18)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  ctaContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    paddingLeft: spacing.xs,
  },

  ctaText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  chevron: {
    opacity: 0.95,
  },
});

export default styles;
