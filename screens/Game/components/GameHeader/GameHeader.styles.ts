// screens/Game/components/GameHeader/GameHeader.styles.ts
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Main container - flexbox row layout
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },

  // Icon buttons (Back/Settings) - circular with background
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  // Center content - Hearts + Timer
  centerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },

  // Hearts container - compact row
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  // Single heart wrapper for animation
  heartWrapper: {
    // Used for pulse animation on error
  },

  // Infinity heart display (when showErrors is false)
  infinityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  infinityText: {
    fontWeight: "600",
  },

  // Timer container - pressable for pause
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },

  // Timer text with monospace numbers
  timerText: {
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },

  // Pause icon next to timer
  pauseIcon: {
    opacity: 0.7,
  },
});

export default styles;
