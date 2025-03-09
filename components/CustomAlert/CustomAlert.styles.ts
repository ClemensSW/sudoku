import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    width: "85%",
    maxWidth: 400,
    borderRadius: radius.xl,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  alertHeader: {
    alignItems: "center",
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  alertContent: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.md,
  },
  alertMessage: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    borderTopWidth: 1,
  },
  buttonStackedContainer: {
    flexDirection: "column",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonFullWidth: {
    width: "100%",
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
});