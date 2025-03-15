import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    padding: spacing.lg,
  },
  backdropBlur: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  contentContainer: {
    backgroundColor: "white",
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: "center",
    maxWidth: 300,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  icon: {
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  purchasingText: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: spacing.md,
  },
  funFactContainer: {
    marginTop: spacing.lg,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.05)",
    borderRadius: radius.lg,
    maxWidth: 250,
  },
  funFactText: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
    opacity: 0.7,
  },
  successAnimationContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
});