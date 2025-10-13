// screens/Duo/components/DevBanner/DevBanner.styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: 40,
    right: -100,
    zIndex: 1000,
    overflow: "visible",
  },
  rotatedWrapper: {
    transform: [{ rotate: "45deg" }],
    width: width * 0.5,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    paddingVertical: 8,
    paddingHorizontal: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
