// screens/DuoGameScreen/DuoGameScreen.styles.ts
import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4, // Reduced horizontal padding
    paddingBottom: spacing.md,
  },
  turnIndicator: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginVertical: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  turnText: {
    fontSize: 18,
    fontWeight: "700",
  },
  player1Color: {
    color: "#FFD700", // Gold for player 1
  },
  player2Color: {
    color: "#32CD32", // Lime green for player 2
  },
  // Background decorative elements
  topDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 220,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: -1,
  },
  // Player info section
  playerInfoContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  playerInfo: {
    alignItems: "center",
    borderRadius: spacing.sm,
    padding: spacing.sm,
    minWidth: 120,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: spacing.xxs,
  },
  playerStatus: {
    fontSize: 12,
    marginTop: spacing.xxs,
  },
  activePlayer: {
    borderWidth: 2,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    width: "100%",
    marginVertical: spacing.sm,
  },
  completedText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4CAF50", // Green for completed
    marginTop: 4,
  },
  gameTimer: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
  }
});