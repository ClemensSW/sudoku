// screens/Duo/components/GameModeCard/GameModeCard.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Outer container with shadow and border
  cardShadow: {
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    overflow: "hidden",
    // Shadow & elevation
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },

  // Inner gradient with content
  cardGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  playIcon: {
    marginLeft: "auto",
  },
});
