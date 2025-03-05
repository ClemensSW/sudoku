import { StyleSheet } from "react-native";
import { spacing, typography, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.layout.screenPadding,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: spacing.xxxl,
  },
  title: {
    ...typography.variant.heading1,
    fontWeight: typography.weight.bold,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.variant.subtitle1,
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
    ...typography.variant.heading3,
    fontWeight: typography.weight.bold,
  },
  difficultyContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  difficultyTitle: {
    ...typography.variant.body1,
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
