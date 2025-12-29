import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  blurView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dialogContainer: {
    width: "85%",
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    // fontSize set dynamically via theme.typography
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
    opacity: 0.8,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  cancelButton: {
    // Background set dynamically
  },
  confirmButton: {
    overflow: "hidden",
    padding: 0,
    paddingVertical: 0,
    paddingHorizontal: 0,
  },
  gradientButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 12,
  },
  cancelButtonText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
  },
  confirmButtonText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
