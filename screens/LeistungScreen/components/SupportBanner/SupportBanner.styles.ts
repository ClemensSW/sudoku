// screens/LeistungScreen/components/SupportBanner/SupportBanner.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

const styles = StyleSheet.create({
  touchableContainer: {
    marginHorizontal: spacing.md,
    marginBottom: 30,
  },

  // NEU: Der Wrapper erlaubt overflow: "visible", damit der Close-Button
  // halb außerhalb positioniert werden kann.
  cardWrapper: {
    position: "relative",
  },

  container: {
    borderRadius: radius.lg,
    borderWidth: 1,
    overflow: "hidden", // Card bleibt sauber gecropped
    position: "relative",
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 100,
    height: "100%",
  },

  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },

  iconContainer: {
    marginRight: spacing.xs,
  },

  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 18, // Kreis
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
    gap: 2,
  },

  title: {
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: -0.2,
  },

  subtitle: {
    fontSize: 13,
    opacity: 0.8,
    letterSpacing: -0.1,
  },

  arrowIcon: {
    opacity: 0.5,
  },


  premiumBadge: {
    position: "absolute",
    top: -1,
    left: spacing.lg + spacing.xl + spacing.md,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: radius.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },

  premiumBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});

export default styles;
