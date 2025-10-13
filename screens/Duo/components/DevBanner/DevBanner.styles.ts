// screens/Duo/components/DevBanner/DevBanner.styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    right: -100,
    zIndex: 1000,
    overflow: "visible",
  },
  rotatedWrapper: {
    transform: [{ rotate: "45deg" }],
    width: width * 0.75,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    paddingVertical: 10,
    paddingHorizontal: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
