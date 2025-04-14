import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none", // So the effect doesn't block touch events
    zIndex: 10,
    overflow: "hidden",
  },
  
  confettiPiece: {
    position: "absolute",
    width: 10,
    height: 10,
    zIndex: 10,
  },
  
  // Various confetti shapes
  confettiSquare: {
    width: 8,
    height: 8,
    borderRadius: 1,
  },
  
  confettiRectangle: {
    width: 12,
    height: 6,
    borderRadius: 1,
  },
  
  confettiCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  
  confettiTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
});