import { StyleSheet } from "react-native";
import { shadows } from "@/utils/theme";

export default StyleSheet.create({
  boardContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    paddingBottom: 16,
    width: "100%",
  },

  boardWrapper: {
    borderRadius: 8,
    overflow: "hidden",
    ...shadows.lg,
  },

  board: {
    width: 324, // 9 cells * 36px per cell
    height: 324,
    borderWidth: 2,
  },

  row: {
    flexDirection: "row",
    height: 36,
  },

  // Animation container
  boardAnimationContainer: {
    overflow: "hidden",
  },

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
});
