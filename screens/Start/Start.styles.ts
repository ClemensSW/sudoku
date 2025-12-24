import { StyleSheet, Dimensions } from "react-native";

const { height } = Dimensions.get("window");

export const BUTTON_AREA_HEIGHT = 240;
export const GRADIENT_OVERLAP = 80;
export const getBackgroundHeight = () => height - BUTTON_AREA_HEIGHT + GRADIENT_OVERLAP;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F172A"
  },
  backgroundContainer: {
    width: "100%",
    position: "relative"
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%"
  },
  safeArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 24,
    zIndex: 10,
  },
  bottomOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonsContainer: {
    paddingTop: 32,
    paddingBottom: 20,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  buttonWrapper: {
    width: "100%",
    maxWidth: 300, // Einheitliche max Breite für alle Buttons
    alignItems: "center",
    marginBottom: 0
  },
  startButton: {
    width: "100%", // Volle Breite des buttonWrapper (maxWidth: 300)
    // height: 56 vom Button Component (gleich wie resumeButton)
  },
  howToPlayButton: {
    marginBottom: 20,
    marginTop: -15,
    alignSelf: "center", // Zentriert den Button
    // Button component übernimmt: padding, borderRadius
  },
  howToPlayText: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.2,
    // Wird mit Button textStyle gemerged
  },
  resumeButton: {
    width: "100%",
    maxWidth: 300,
    height: 56,
    borderRadius: 18,
    borderWidth: 1.5,
    backgroundColor: 'transparent',
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  resumeButtonText: {
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3
  },
});
