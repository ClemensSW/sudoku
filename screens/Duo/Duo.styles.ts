// screens/Duo/Duo.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContent: {
    // Components handle their own horizontal margins
  },

  // Game Mode Cards Section
  gameModeSection: {
    paddingHorizontal: 20,
    marginTop: 8,      // Total zu Hero: 16 + 8 = 24px
    marginBottom: 8,   // Total zu Leaderboard: 12 + 8 = 20px
    gap: 12,           // Zwischen den Buttons
  },

  // Scroll Indicator Wrapper
  scrollIndicatorWrapper: {
    marginTop: spacing.xl,
    marginBottom: spacing.lg,
    alignItems: "center",
  },

  // Features Section
  featuresSection: {
    marginTop: spacing.md,
    paddingHorizontal: 20,
  },
});
