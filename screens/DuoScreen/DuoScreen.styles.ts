// screens/DuoScreen/DuoScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    position: "absolute",
    width: width,
    height: height,
    opacity: 0.2,
  },
  scrollContent: {
    paddingBottom: 100, // Space for bottom navigation
  },
  mainScreen: {
    alignItems: "center",
    justifyContent: "space-between", // Changed to space-between for better spacing
    paddingHorizontal: 20,
    position: "relative",
  },
  // Container to group visualizer and button together
  centralContentContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 20,
    // Add padding top to move content down from header
    paddingTop: 60,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 40, // Space between visualizer and button
  },
  startButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 30,
    width: "100%",
    maxWidth: 320,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  startButtonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
  // Adjusted positioning for scroll indicator to be closer to navigation bar
  scrollIndicatorContainer: {
    marginBottom: 40, // Reduced to bring the indicator closer to nav bar
    width: "100%",
    alignItems: "center",
  },
  featuresScreen: {
    minHeight: height * 0.9,
    paddingHorizontal: 20,
  },
});