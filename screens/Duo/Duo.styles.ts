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
    gap: 12,
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
