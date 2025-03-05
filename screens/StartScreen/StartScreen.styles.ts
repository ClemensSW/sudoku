// screens/StartScreen/StartScreen.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 64, // Direct value instead of spacing.xxxl
  },
  title: {
    fontSize: 32, // Direct value instead of typography.size.xxxl
    fontWeight: "bold",
    marginBottom: 4, // Direct value instead of spacing.xs
  },
  subtitle: {
    fontSize: 18, // Direct value instead of typography.size.lg
    fontWeight: "600", // Direct value instead of typography.weight.semibold
    textAlign: "center",
  },
  logoContainer: {
    marginBottom: 64, // Direct value instead of spacing.xxxl
  },
  logoPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: 8, // Direct value instead of radius.md
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    width: 120,
    height: 120,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  gridCell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridNumber: {
    fontSize: 20, // Direct value instead of typography.size.xl
    fontWeight: "bold",
  },
  difficultyContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 48, // Direct value instead of spacing.xxl
  },
  difficultyTitle: {
    fontSize: 16, // Direct value instead of typography.size.md
    fontWeight: "normal", // Direct value instead of typography.weight.regular
    marginBottom: 16, // Direct value instead of spacing.md
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  startButton: {
    paddingHorizontal: 32, // Direct value instead of spacing.xl
  },
});
