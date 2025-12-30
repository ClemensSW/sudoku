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
  // Content-Container für festes Layout (ersetzt ScrollView)
  gameContent: {
    flex: 1,
    paddingHorizontal: 8,
  },
  // Board-Container für vertikale Zentrierung
  boardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  // Controls am unteren Rand
  controlsContainer: {
    width: "100%",
    alignItems: "center",
    paddingBottom: spacing.md,
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