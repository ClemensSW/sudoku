// screens/DuoGameScreen/components/DuoBoard.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  boardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.lg,
    position: "relative",
  },
  board: {
    width: 320,
    height: 320,
    borderWidth: 2,
    borderColor: "#000",
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
    height: 35.5, // Gesamthöhe / 9
  },
  cell: {
    width: 35.5, // Gesamtbreite / 9
    height: 35.5,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  player1Cell: {
    backgroundColor: "rgba(72, 209, 104, 0.1)", // Leicht grün für Spieler 1
  },
  player2Cell: {
    backgroundColor: "rgba(255, 196, 0, 0.1)", // Leicht gelb für Spieler 2
  },
  fixedCell: {
    backgroundColor: "#e0e0e0", // Grau für vorausgefüllte Zellen
  },
  fixedCellText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  rotatedCell: {
    transform: [{ rotate: "180deg" }],
    width: "100%",
    height: "100%",
  },
  rotatedText: {
    transform: [{ rotate: "180deg" }],
  },
  playerLabel: {
    position: "absolute",
    padding: spacing.xs,
    borderRadius: spacing.sm,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  player1Label: {
    top: -40,
    transform: [{ rotate: "180deg" }],
  },
  player2Label: {
    bottom: -40,
  },
  playerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
