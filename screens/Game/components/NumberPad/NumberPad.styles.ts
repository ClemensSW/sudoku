import { StyleSheet, Dimensions } from "react-native";

// Calculate button sizes based on screen dimensions (like DuoGameControls)
const { width } = Dimensions.get("window");
const ACTION_BUTTON_WIDTH = Math.min(width / 3 - 16, 95); // For 3 buttons
const ACTION_BUTTON_WIDTH_TWO = Math.min(width / 3 - 8, 110); // For 2 buttons + hearts
const ACTION_BUTTON_HEIGHT = 48;

const actionButtonShadow = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.08,
  shadowRadius: 4,
  elevation: 2,
};

export default StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
  },

  // Action Buttons Row - Duo-style horizontal layout
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginBottom: 4,
    paddingHorizontal: 8,
    height: ACTION_BUTTON_HEIGHT,
  },

  // Wrapper for each action button
  actionButtonWrapper: {
    alignItems: "center",
    justifyContent: "center",
    height: ACTION_BUTTON_HEIGHT,
  },

  // Action button style - Duo-style
  actionButton: {
    height: ACTION_BUTTON_HEIGHT,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...actionButtonShadow,
  },

  // Text style for action buttons
  actionButtonText: {
    fontWeight: "600",
    marginLeft: 5,
  },

  // Disabled button style
  disabledButton: {
    opacity: 0.5,
  },

  // Container for error indicator (hearts)
  errorIndicatorContainer: {
    width: ACTION_BUTTON_WIDTH_TWO,
    height: ACTION_BUTTON_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
  },

  // Minimalistisches Zahlen-Layout (unchanged)
  numbersRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },

  // Container für jede Zahl - FESTE GRÖSSE verhindert Verschiebung
  numberItem: {
    width: 36,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },

  // Pressable-Bereich für Touch-Feedback
  numberPressable: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  // Minimalistischer Zahlen-Text
  numberText: {
    fontSize: 32,
    fontWeight: "500",
    // color wird dynamisch mit pathColorHex gesetzt
  },
});

// Export constants for use in component
export { ACTION_BUTTON_WIDTH, ACTION_BUTTON_WIDTH_TWO, ACTION_BUTTON_HEIGHT };
