// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.styles.ts
import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");
const BOARD_SIZE = Math.min(width * 0.85, 340);
const CONCEPT_SIZE = BOARD_SIZE * 0.9; // Etwas kleiner für Padding

export default StyleSheet.create({
  boardContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  // Player Labels
  playerIndicator: {
    height: 40,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  playerTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  playerIcon: {
    marginRight: 8,
  },
  playerText: {
    fontWeight: "700",
    fontSize: 14,
  },
  // Concept Board Container
  conceptBoardContainer: {
    width: BOARD_SIZE,
    height: BOARD_SIZE,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 10,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  // The abstract board visualization
  conceptBoard: {
    width: CONCEPT_SIZE,
    height: CONCEPT_SIZE,
    borderRadius: 16,
    overflow: "hidden",
    flexDirection: "column",
  },
  // The two player areas
  playerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
  },
  player1Area: {
    backgroundColor: "#CAD9D4", // Salbei
  },
  player2Area: {
    backgroundColor: "#F4F0E4", // Creme
  },
  // Example numbers in each area
  numberGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 10,
  },
  numberCell: {
    width: 40,
    height: 40,
    borderRadius: 6,
    backgroundColor: "rgba(255,255,255,0.4)",
    justifyContent: "center",
    alignItems: "center",
    margin: 6,
  },
  numberText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2D3748",
  },
  // Divider between player areas
  dividerContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    width: CONCEPT_SIZE,
    height: 50,
    zIndex: 10,
  },
  divider: {
    height: 2,
    backgroundColor: "#FFFFFF",
    width: CONCEPT_SIZE,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  // Yin Yang symbol container
  yinYangContainer: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 20,
  },
  yinYangImage: {
    width: 40,
    height: 40,
  },
  // Elements showing rotation for player 2
  rotatedNumberCell: {
    transform: [{ rotate: "180deg" }]
  },
  // Direction arrows
  arrowContainer: {
    position: "absolute",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    zIndex: 5,
  },
  topArrow: {
    top: 55,
    right: 40,
  },
  bottomArrow: {
    bottom: 55,
    left: 40,
  }
});