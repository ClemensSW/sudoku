import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    zIndex: 9999,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    paddingTop: height * 0.06, // Safe area approximation
    zIndex: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: height * 0.1, // Extra padding at bottom
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 15,
    opacity: 0.7,
    marginBottom: 20,
    lineHeight: 22,
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 0, // Reduzierter Abstand
  },
  // Special container for subscriptions section
  subscriptionsContainer: {
    marginTop: 32,
    marginBottom: 20,
  },
  // Loader container
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  // Thank you section at bottom
  thanksContainer: {
    marginVertical: 28,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    borderStyle: "dashed",
  },
  thanksText: {
    fontSize: 15,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 22,
  },
  thanksEmoji: {
    fontSize: 24,
    marginTop: 8,
  },
  // Success message container that slides in from bottom
  successMessage: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  successIcon: {
    marginRight: 16,
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  successSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
});
