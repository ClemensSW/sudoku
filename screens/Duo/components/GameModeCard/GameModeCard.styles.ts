// screens/Duo/components/GameModeCard/GameModeCard.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    overflow: "hidden",
    // Original height restored
    paddingVertical: 18,
    paddingHorizontal: 20,
    minHeight: 84,
    // Shadow & elevation
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  title: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.2,
    textAlign: "center",
  },

  playIconContainer: {
    position: "absolute",
    right: 20,
    opacity: 0.6,
  },
});
