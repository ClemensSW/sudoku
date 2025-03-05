import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  segmentedControlContainer: {
    flexDirection: "row",
    height: 44,
    width: "92%", // Slightly narrower than parent for visual balance
    maxWidth: 360,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },

  difficultyButtonsRow: {
    flexDirection: "row",
    flex: 1,
    position: "relative",
    zIndex: 2,
  },

  button: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },

  selectedButtonText: {
    fontWeight: "700",
  },

  // Animated sliding indicator that moves to selected position
  animatedIndicator: {
    position: "absolute",
    top: 4,
    bottom: 4,
    borderRadius: 8,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
