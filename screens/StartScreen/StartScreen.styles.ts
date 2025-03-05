import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },

  titleContainer: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },

  title: {
    fontSize: 40,
    fontWeight: "800",
    marginBottom: spacing.xs,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    maxWidth: 300,
  },

  logoContainer: {
    marginBottom: spacing.xxxl,
    alignItems: "center",
  },

  logoBackground: {
    width: 200,
    height: 200,
    borderRadius: radius.xl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },

  gridContainer: {
    width: 140,
    height: 140,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
  },

  gridCell: {
    width: "33.33%",
    height: "33.33%",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  gridNumber: {
    fontSize: 24,
    fontWeight: "bold",
  },

  difficultyContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.xxl,
    paddingHorizontal: spacing.md,
  },

  difficultyTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: spacing.lg,
    textAlign: "center",
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

  // Decorative elements
  decorCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    opacity: 0.2,
    top: -50,
    right: -50,
  },

  decorCircle2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.15,
    bottom: -30,
    left: -30,
  },
});
