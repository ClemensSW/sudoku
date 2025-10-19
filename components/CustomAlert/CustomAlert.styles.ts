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
    backgroundColor: "rgba(0, 0, 0, 0.4)", // Lighter, less oppressive
  },
  alertContainer: {
    width: "90%", // Narrower for elegance
    maxWidth: 340,
    borderRadius: 20, // Softer corners
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, // Subtler shadow
    shadowRadius: 12,
  },
  alertHeader: {
    alignItems: "center",
    paddingTop: 28, // More whitespace
    paddingBottom: 12,
  },
  iconContainer: {
    width: 48, // Smaller, more subtle
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  alertContent: {
    paddingHorizontal: 28, // More generous padding
    paddingBottom: 28,
  },
  alertTitle: {
    fontSize: 18, // Slightly smaller
    fontWeight: "600", // Semibold instead of bold
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: 0.3, // Airier feel
  },
  alertMessage: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22.5, // 1.5 line-height
    letterSpacing: 0.2,
  },
  buttonContainer: {
    flexDirection: "row",
    // No borderTop - cleaner look
    padding: 16,
    gap: 8, // Modern gap property for spacing
  },
  buttonStackedContainer: {
    flexDirection: "column",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonFullWidth: {
    width: "100%",
  },
  alertButton: {
    width: "100%",
    // Button component übernimmt: height, padding, borderRadius, backgroundColor
  },
});
