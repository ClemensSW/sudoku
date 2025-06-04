import { StyleSheet, Dimensions, Platform } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

// Tag colors - vibrant, modern palette
export const tagColors = {
  category: {
    background: "rgba(94, 114, 228, 0.85)",
    text: "#FFFFFF",
    icon: "#FFFFFF"
  },
  complete: {
    background: "rgba(45, 206, 137, 0.85)",
    text: "#FFFFFF",
    icon: "#FFFFFF"
  },
  inProgress: {
    background: "rgba(251, 99, 64, 0.85)",
    text: "#FFFFFF",
    icon: "#FFFFFF"
  },
  almostComplete: {
    background: "rgba(255, 214, 0, 0.85)",
    text: "#FFFFFF",
    icon: "#FFFFFF"
  },
  favorite: {
    background: "rgba(245, 54, 92, 0.85)",
    text: "#FFFFFF",
    icon: "#FFFFFF"
  },
  date: {
    background: "rgba(45, 206, 137, 0.85)",
    text: "#FFFFFF",
    icon: "#FFFFFF"
  },
  currentProject: {
    background: "rgba(66, 153, 225, 0.85)",
    text: "#FFFFFF",
    icon: "#FFFFFF"
  }
};

export default StyleSheet.create({
  // Main containers
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#000000",
    zIndex: 2000,
  },
  
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  
  // Image Container and Styles
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  
  // Header Styles
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    position: "relative",
    zIndex: 10,
  },
  
  headerBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 1,
  },
  
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    marginHorizontal: spacing.md,
  },
  
  // Control Buttons
  controlButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    backdropFilter: Platform.OS === "ios" ? "blur(12px)" : undefined,
  },
  
  // Footer Styles
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  
  footerContent: {
    padding: spacing.lg,
    position: "relative",
    zIndex: 10,
  },
  
  footerBlur: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  
  footerGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
    zIndex: 1,
  },
  
  // Landscape Info
  
  
  description: {
    fontSize: 15,
    color: "rgba(255, 255, 255, 0.85)",
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  
  // Modern Tags Container
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: spacing.xs,
  },
  
  tag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xxs + 2,
    borderRadius: 20,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  
  tagIcon: {
    marginRight: 6,
  },
  
  tagText: {
    fontSize: 13,
    fontWeight: "600",
  },
  
  // Incomplete Image Placeholder
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  
  blurredBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  
  // Segments Grid
  gridContainer: {
    width: width * 0.8,
    height: width * 0.8,
    flexDirection: "row",
    flexWrap: "wrap",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  
  gridSegment: {
    width: "33.33%",
    height: "33.33%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  lockedSegment: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  
  // Progress Indicators
  progressText: {
    marginTop: spacing.lg,
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
  },
  
  progressBarContainer: {
    width: width * 0.6,
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    marginTop: spacing.md,
    overflow: "hidden",
  },
  
  progressBar: {
    height: "100%",
    borderRadius: 4,
  },

  // Neue Styles für den Freischalt-Button
  footerActionButton: {
    marginTop: spacing.md,
    width: "100%",
    alignItems: "center",
  },

  selectProjectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: 24,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },

  selectButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});