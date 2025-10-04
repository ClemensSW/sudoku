import { StyleSheet, Dimensions } from "react-native";
import { spacing } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  fullScreen: {
    flex: 1,
  },

  blurView: {
    ...StyleSheet.absoluteFillObject,
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
  },

  modalContainer: {
    width: Math.min(width * 0.9, 500),
    maxHeight: height * 0.85,
    borderRadius: 24,
    padding: spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },

  header: {
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
  },

  statusContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },

  statusRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  statusItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  statusValue: {
    fontSize: 18,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },

  statusDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(128,128,128,0.2)",
  },

  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  tipsContainer: {
    marginBottom: spacing.sm,
  },

  tipsSection: {
    marginBottom: spacing.md,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: spacing.md,
    textAlign: "center",
  },

  tipItem: {
    flexDirection: "column",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: spacing.sm,
  },

  tipIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: spacing.sm,
    textAlign: "center",
  },

  tipDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },

  buttonContainer: {
    marginTop: spacing.sm,
  },
});
