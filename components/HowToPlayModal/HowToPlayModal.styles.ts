import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { height } = Dimensions.get("window");

export default StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    width: "90%",
    maxHeight: height * 0.8,
    borderRadius: radius.lg,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  closeButton: {
    padding: spacing.xs,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    paddingBottom: spacing.xxl,
  },

  // Sudoku-Grid Visualisierung
  gridVisualContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.lg,
  },

  sudokuGridVisual: {
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },

  // Grid-Reihen und Zellen
  gridRow: {
    flexDirection: "row",
  },

  gridCell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },

  gridCellText: {
    fontSize: 20,
    fontWeight: "bold",
  },

  visualExplanation: {
    marginTop: spacing.sm,
    fontSize: 14,
    fontWeight: "500",
  },

  // Tutorial-Schritte
  tutorialStep: {
    flexDirection: "row",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },

  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },

  stepContent: {
    flex: 1,
  },

  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },

  stepDescription: {
    fontSize: 14,
    lineHeight: 20,
  },

  // Tipps
  tipsContainer: {
    marginTop: spacing.lg,
  },

  tipsTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
  },

  tipBox: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },

  tipText: {
    fontSize: 14,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
});
