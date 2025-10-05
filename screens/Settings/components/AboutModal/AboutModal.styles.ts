// screens/Settings/components/AboutModal/AboutModal.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: "100%",
    maxWidth: 480,
    maxHeight: "90%",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  versionBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  scrollView: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    lineHeight: 26,
  },
  section: {
    marginBottom: 16,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.2,
  },
  closingSection: {
    marginBottom: 0,
  },
  signature: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    lineHeight: 24,
  },
  closeButton: {
    marginHorizontal: 20,
    marginVertical: 16,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});
