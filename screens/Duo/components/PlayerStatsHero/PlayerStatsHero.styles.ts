// screens/Duo/components/PlayerStatsHero/PlayerStatsHero.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Card container with glowing shadow (like LevelCard)
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden", // Clips shadow to rounded corners
    // iOS Shadow (glowing effect)
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  // Hero header with gradient
  heroHeader: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 16,
    alignItems: "center",
  },

  // Battle icon - Duo Mode identifier (hero-sized)
  battleIconContainer: {
    marginTop: 24,
    marginBottom: 16,
  },

  // Title section
  titleSection: {
    alignItems: "center",
    marginBottom: 72,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Stats row - contains stat cards
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    marginBottom: 16,
    gap: 12,
    width: "100%",
  },

  // Wrapper for equal width stat cards
  statCardWrapper: {
    flex: 1,
  },

  // Premium stat card with border and background
  statCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: "hidden",
    // iOS Shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // Inner gradient container for stat cards
  statCardGradient: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 12,
  },

  // Icon glow container for positioning
  iconGlowContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    width: 60,
    height: 60,
  },

  // Glow effect behind icon (very subtle, 4px larger than icon)
  iconGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
  },

  // Larger circular icon container (56x56)
  statIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  // Larger, bolder stat value
  statValue: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 4,
    letterSpacing: -0.5,
  },

  // Stat label
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Rank card - full width with metallic effect
  rankCard: {
    borderRadius: 16,
    borderWidth: 1.5,
    width: "100%",
    overflow: "hidden",
    // iOS Shadow
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  // Inner gradient container
  rankCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
    overflow: "hidden",
  },

  // Animated shine effect (gleaming metallic strip)
  shine: {
    position: "absolute",
    width: 60,
    height: 200,
    top: -50,
    left: 0,
  },

  // Badge container with glow
  rankBadgeContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },

  // Glow effect behind badge
  rankBadgeGlow: {
    position: "absolute",
    width: 64,
    height: 64,
    borderRadius: 32,
  },

  // Rank text container
  rankTextContainer: {
    flex: 1,
    gap: 2,
  },

  // Rank tier name (e.g., "Silver", "Gold")
  rankName: {
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // Large ELO value display
  eloValue: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  // ELO label (smaller suffix)
  eloLabel: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Progress container
  progressContainer: {
    gap: 4,
    marginTop: 4,
  },

  // Progress track (background) - taller for better visibility
  progressTrack: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },

  // Gradient progress fill
  progressFillGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },

  // Progress text
  progressText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Chevron indicator for clickable card
  rankChevron: {
    marginLeft: 4,
  },

  // Login prompt (when not logged in)
  loginPrompt: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loginText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  // Footer with tutorial link
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
  tutorialButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 6,
  },
  tutorialButtonText: {
    fontSize: 13,
    fontWeight: "500",
  },
});

export default styles;
