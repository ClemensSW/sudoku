// screens/DuoScreen/DuoScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: { flex: 1 },

  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    opacity: 0.2,
  },

  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },

  // FULL-WIDTH STAGE CONTAINER (kein Padding!)
  mainScreen: {
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
    overflow: "hidden", // schneidet Effekte sauber am Rand ab
  },

  // absoluter Overlay-Layer für den Visualizer
  overlayLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    pointerEvents: "box-none",
  },

  // Content-Container bekommt das Padding (nicht der Parent!)
  centralContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    zIndex: 2, // über dem Overlay
  },

  // Scroll-Indicator sichtbar über Overlay
  scrollIndicatorContainer: {
    marginBottom: 40,
    width: "100%",
    alignItems: "center",
    zIndex: 2, // über dem Overlay
  },

  featuresScreen: {
    minHeight: height * 0.9,
    paddingHorizontal: 20,
  },
});
