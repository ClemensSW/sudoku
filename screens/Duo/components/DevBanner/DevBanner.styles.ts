// screens/Duo/components/DevBanner/DevBanner.styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    position: "absolute",
    top: 25,
    right: -60,
    zIndex: 1000,
    overflow: "visible",
  },
  rotatedWrapper: {
    transform: [{ rotate: "45deg" }],
    width: width * 0.8,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    paddingVertical: 20,
    paddingRight: 50,
    paddingHorizontal: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 12,
    minWidth: 380,
  },
  icon: {
    marginRight: 6,
  },
  text: {
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    flexShrink: 0,
  },
});
