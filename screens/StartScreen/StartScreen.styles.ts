import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";
import typography from "@/utils/theme/typography";

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
    marginBottom: spacing.xxxl,
  },
  title: {
    fontSize: typography.size.xxxl,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.size.lg,
    fontWeight: typography.weight.semibold,
    textAlign: "center",
  },
  logoContainer: {
    marginBottom: spacing.xxxl,
  },
  logoPlaceholder: {
    width: 160,
    height: 160,
    borderRadius: radius.md,
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
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
  },
  difficultyContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  difficultyTitle: {
    fontSize: typography.size.md,
    fontWeight: typography.weight.regular,
    marginBottom: spacing.md,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  startButton: {
    paddingHorizontal: spacing.xl,
  },
});
