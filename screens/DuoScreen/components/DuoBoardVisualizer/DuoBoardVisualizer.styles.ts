// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width * 0.85, 350);
const CELL_SIZE = BOARD_SIZE / 9;

export default StyleSheet.create({
  boardContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  playerIndicator: {
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  playerTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  playerIcon: {
    marginRight: 6,
  },
  playerText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 12,
  },
  demoBoard: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  grid: {
    flex: 1,
    position: "relative",
  },
  demoRow: {
    flex: 1,
    flexDirection: "row",
  },
  demoCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(150,150,150,0.2)",
  },
  middleCell: {
    borderWidth: 1.5,
    borderColor: "rgba(150,150,150,0.4)",
    backgroundColor: "rgba(255,255,255,0.05)", // Very subtle highlighting
  },
  player1Cell: {
    backgroundColor: "rgba(76, 99, 230, 0.05)", // Very light blue
  },
  player2Cell: {
    backgroundColor: "rgba(255, 193, 7, 0.05)", // Very light yellow
  },
  demoCellText: {
    fontSize: 16,
    fontWeight: "600",
  },
  rotatedText: {
    transform: [{ rotate: "180deg" }]
  },
  yinYangContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  yinYangImage: {
    width: 26,
    height: 26,
  }
});