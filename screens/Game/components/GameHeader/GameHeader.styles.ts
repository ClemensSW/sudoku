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

  // Center content - Timer only (hearts moved to controls)
  centerContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // Timer container - pressable for pause
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  // Timer text with monospace numbers
  timerText: {
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },

  // Pause icon next to timer
  pauseIcon: {
    opacity: 0.8,
  },
});

export default styles;
