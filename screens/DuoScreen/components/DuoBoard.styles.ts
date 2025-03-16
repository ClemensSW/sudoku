// screens/DuoScreen/components/DuoBoard.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { spacing } from "@/utils/theme";

// Compute optimal board size based on screen width
const { width } = Dimensions.get("window");
export const BOARD_SIZE = Math.min(width * 0.9, 360);
export const CELL_SIZE = BOARD_SIZE / 9;

export default StyleSheet.create({
  boardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.md,
    position: "relative",
  },
  board: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    backgroundColor: "#1E2233", // Darker anthracite background
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  row: {
    flexDirection: "row",
    height: CELL_SIZE,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
  },
  cellText: {
    fontSize: 18,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  player1Area: {
    backgroundColor: "rgba(76, 175, 80, 0.1)", // Light green for player 1
  },
  player2Area: {
    backgroundColor: "rgba(255, 193, 7, 0.1)", // Light yellow for player 2
  },
  divider: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.3)",
    width: "100%",
    position: "absolute",
    top: BOARD_SIZE / 2,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.2)",
    zIndex: 5,
  },
  horizontalGridLine: {
    width: BOARD_SIZE,
    height: 1.5,
    left: 0,
  },
  verticalGridLine: {
    width: 1.5,
    height: BOARD_SIZE,
    top: 0,
  },
  rotatedView: {
    transform: [{ rotate: "180deg" }],
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  rotatedText: {
    transform: [{ rotate: "180deg" }],
  },
  rotatedCell: {
    transform: [{ rotate: "180deg" }],
    width: "100%",
    height: "100%",
  },
  playerLabel: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: spacing.sm,
    marginVertical: spacing.sm,
  },
  player1Label: {
    transform: [{ rotate: "180deg" }],
    position: "absolute",
    top: -40,
  },
  player2Label: {
    position: "absolute",
    bottom: -40,
  },
  playerLabelText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  playerText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  fixedCell: {
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  fixedCellText: {
    fontWeight: "700",
    color: "#FFFFFF",
  },
  sharedCell: {
    backgroundColor: "rgba(100, 100, 255, 0.15)", // Special blue for the shared middle cell
  },
  borderRight: {
    borderRightWidth: 2,
    borderRightColor: "rgba(255,255,255,0.25)",
  },
  borderBottom: {
    borderBottomWidth: 2,
    borderBottomColor: "rgba(255,255,255,0.25)",
  },
});
