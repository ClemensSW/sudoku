// screens/DuoScreen/DuoScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

// Calculate sizes for the game visualizer - more compact
const VISUALIZER_WIDTH = width * 0.9;
const VISUALIZER_HEIGHT = VISUALIZER_WIDTH * 0.9; // Reduced height ratio for compactness
const GRID_CELL_SIZE = VISUALIZER_WIDTH / 12;

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
    marginBottom: spacing.xl, // Increased margin
  },
  duoLogo: {
    flexDirection: "row",
    marginBottom: spacing.md, // Increased margin
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
    fontSize: 36, // Slightly smaller
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8, // Reduced margin
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16, // Slightly smaller
    textAlign: "center",
    opacity: 0.8,
    maxWidth: 300,
    fontWeight: "500",
    color: "#fff",
  },

  // Game Visualizer - Compact but professional version
  gameVisualizerContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.xxl, // Significantly increased margin
  },
  gameVisualizer: {
    width: VISUALIZER_WIDTH,
    height: "100%", // Will be constrained by parent
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
    left: -500,
    width: 60,
    height: VISUALIZER_HEIGHT + 300,
    backgroundColor: "white",
    transform: [{ rotate: "30deg" }],
    zIndex: 10,
    opacity: 0.3,
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
    padding: spacing.sm, // Smaller padding
    borderRadius: radius.lg,
    backgroundColor: "rgba(255,255,255,0.1)",
    zIndex: 5,
  },
  playerAvatar: {
    width: 40, // Smaller avatar
    height: 40, // Smaller avatar
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6, // Reduced spacing
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  playerName: {
    fontSize: 14, // Smaller text
    fontWeight: "700",
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
    marginLeft: -24, // Smaller offset for smaller badge
    marginTop: -24, // Smaller offset for smaller badge
    width: 48, // Smaller badge
    height: 48, // Smaller badge
    borderRadius: 24,
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
    fontSize: 16, // Smaller text
    fontWeight: "800",
    color: "white",
  },

  // Scroll indicator - More visible with better spacing
  scrollIndicator: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.xxl, // Much more space below
    paddingVertical: 12, // More touch area
    width: '100%',
  },
  scrollIndicatorContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollHint: {
    fontSize: 16, // Larger text
    marginTop: 6,
    fontWeight: "500",
  },

  // How it works section - Repositioned after CTA
  howItWorksContainer: {
    width: "100%",
    marginTop: spacing.xl, // More space above this section
    marginBottom: spacing.lg,
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

  // Call to action - More generous spacing
  ctaContainer: {
    width: "100%",
    paddingHorizontal: 16,
    alignItems: "center",
    marginTop: spacing.xl,
    marginBottom: spacing.xl, // Increased margin
  },
  ctaButton: {
    width: "100%",
    maxWidth: 320, // Slightly wider for better proportion
    height: 64, // Taller button for better tap area
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
    fontSize: 20, // Slightly larger text
    fontWeight: "700",
    color: "white",
  },

  // Modal for difficulty selection
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