import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  scrollContent: {
    flexGrow: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  gameContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8, // Reduzierter horizontaler Abstand für mehr Platz
    paddingBottom: spacing.md,
  },

  timerContainer: {
    width: "100%",
    marginTop: spacing.md,
    marginBottom: spacing.sm, // Kleiner für besseren Platz
    alignItems: "center",
    justifyContent: "center",
  },

  boardContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: 8, // 8px Randabstand wie gewünscht
    marginBottom: spacing.sm, // Kleinerer Abstand zum NumberPad für mehr Platz
  },

  controlsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 0, // Kein zusätzliches Padding
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
