// screens/StartScreen/StartScreen.styles.ts
import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    width: "100%",
    height: "100%",
  },

  safeArea: {
    flex: 1,
  },

  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    resizeMode: "cover",
  },

  topButtonsContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    zIndex: 10,
  },

  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center", // Geändert zu center, um Elemente zu zentrieren
    paddingHorizontal: spacing.md,
  },

  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.lg, // Abstand zwischen Titel und Button - anpassbar
  },

  title: {
    fontSize: 60,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: 2,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },

  // New container for the How To Play button
  howToPlayContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.lg,
  },

  buttonContainer: {
    width: "100%",
    alignItems: "center",
    paddingHorizontal: spacing.xl,
  },

  startButton: {
    width: "100%",
    maxWidth: 300,
    height: 58,
  },

  howToPlayButton: {
    width: "100%",
    maxWidth: 300,
    height: 48,
  },

  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modalContent: {
    width: "90%",
    maxWidth: 400,
    borderRadius: radius.xl,
    padding: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },

  modalTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: spacing.xs,
    textAlign: "center",
  },

  modalSubtitle: {
    fontSize: 16,
    marginBottom: spacing.lg,
    textAlign: "center",
    opacity: 0.8,
  },

  difficultyButtonsContainer: {
    width: "100%",
    marginVertical: spacing.md,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    marginBottom: spacing.xl,
  },

  difficultyButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    width: "100%",
    alignItems: "center",
    position: "relative",
    height: 56,
    justifyContent: "center",
  },

  difficultyButtonText: {
    fontSize: 19,
    fontWeight: "600",
    textAlign: "center",
  },

  selectedIndicator: {
    width: 6,
    position: "absolute",
    top: "15%",
    bottom: "15%",
    left: 0,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
  },

  // Prominent CTA Button
  modalCTAButton: {
    width: "100%",
    height: 60,
    borderRadius: radius.xl,
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  modalCTAText: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.5,
  },

  // Cancel button as text link
  modalCancelButton: {
    padding: spacing.md,
    marginTop: spacing.sm,
  },

  modalCancelText: {
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.7,
  },
});
