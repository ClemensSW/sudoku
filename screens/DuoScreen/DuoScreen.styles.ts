// screens/DuoScreen/DuoScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

// Calculate sizes for the game visualizer
const VISUALIZER_WIDTH = width * 0.9;
const VISUALIZER_HEIGHT = VISUALIZER_WIDTH * 1.2;
const GRID_CELL_SIZE = VISUALIZER_WIDTH / 12; // Smaller cells for visibility

export default StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  safeArea: {
    flex: 1,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    opacity: 0.05,
  },
  header: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 10,
  },
  iconButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  duoLogo: {
    flexDirection: "row",
    marginBottom: 16,
  },
  logoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  title: {
    fontSize: 38,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "center",
    opacity: 0.8,
    maxWidth: 300,
    fontWeight: "500",
    color: "#fff",
  },

  // Game Visualizer - Premium animated version
  gameVisualizerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  gameVisualizer: {
    width: VISUALIZER_WIDTH,
    height: VISUALIZER_HEIGHT,
    borderRadius: radius.xl,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
    borderWidth: 1,
  },
  // Shine effect that moves across the visualizer
  shineEffect: {
    position: "absolute",
    top: -150,
    left: -500, // Weiter links beginnen
    width: 60, // Etwas breiter machen
    height: VISUALIZER_HEIGHT + 300, // Länger machen, um komplette Diagonale abzudecken
    backgroundColor: "white",
    transform: [{ rotate: "30deg" }],
    zIndex: 10,
    opacity: 0.3, // Transparenz beibehalten
  },
  boardTop: {
    height: "50%",
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  boardBottom: {
    height: "50%",
    width: "100%",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  // Breathing glow effect behind players
  playerGlow: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.05,
  },
  playerContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.1)",
    zIndex: 5,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "700",
  },

  // Example sudoku cells in each player's area
  sudokuExampleContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 1,
  },
  sudokuRow: {
    flexDirection: "row",
  },
  sudokuCell: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    margin: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  sudokuCellText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  sudokuCellTextRotated: {
    transform: [{ rotate: "180deg" }],
  },

  // Grid overlay to subtly illustrate the board
  gridOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.05,
    padding: spacing.md,
  },
  gridRow: {
    flexDirection: "row",
    flex: 1,
  },
  gridCell: {
    flex: 1,
    borderWidth: 0.5,
    margin: 0.5,
  },

  // VS divider and badge
  divider: {
    height: 2,
    width: "90%",
    position: "absolute",
    top: "50%",
    left: "5%",
    marginTop: -1,
    zIndex: 5,
  },
  versusContainer: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: -28,
    marginTop: -28,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  versusText: {
    fontSize: 18,
    fontWeight: "800",
    color: "white",
  },

  // How it works section
  howItWorksContainer: {
    width: "100%",
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  howItWorksTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: spacing.md,
    textAlign: "center",
  },
  howItWorksList: {
    width: "100%",
  },
  howItWorksItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  howItWorksIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  howItWorksText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 22,
  },

  // Features section
  featuresContainer: {
    width: "100%",
    marginVertical: spacing.lg,
  },
  featureCardsContainer: {
    width: "100%",
  },
  featureCard: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderLeftWidth: 4,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    opacity: 0.7,
    lineHeight: 20,
  },

  // Call to action
  ctaContainer: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    marginVertical: spacing.xl,
  },
  ctaButton: {
    width: "100%",
    maxWidth: 300,
    height: 64,
    borderRadius: radius.xl,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },

  // Modal for difficulty selection - simplified and modernized
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    width: "85%",
    maxWidth: 400,
    borderRadius: radius.xl,
    padding: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    opacity: 0.8,
  },
  difficultyButtonsContainer: {
    width: "100%",
    borderRadius: radius.lg,
    overflow: "hidden",
    marginBottom: 24,
  },
  difficultyButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    width: "100%",
  },
  difficultyButtonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  modalCTAButton: {
    width: "100%",
    height: 60,
    borderRadius: radius.xl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalCTAText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
  },
});
