// screens/GameScreen/GameScreen.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Content-Container für festes Layout
  gameContent: {
    flex: 1,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  // Flexibler Spacer für gleiche Abstände
  spacer: {
    flex: 1,
  },
  // Controls - natürliche Höhe (kein flex)
  controlsContainer: {
    width: "100%",
    alignItems: "center",
  },
  // Background decorative elements
  topDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: -1,
  },
});