import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width } = Dimensions.get("window");

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  
  content: {
    flex: 1,
  },
  
  // New custom header container for info button
  customHeaderContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    zIndex: 10,
  },
  
  // Info button style
  infoButton: {
    position: "absolute",
    right: 16,
    top: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  
  // New wrapper for tabs to add elevation effect
  tabsContainerWrapper: {
    width: "100%",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
    borderBottomWidth: 0,
  },
  
  tabsContainer: {
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    paddingHorizontal: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative", // For absolute positioning of the indicator
    borderBottomWidth: 1, // Thinner border
  },
  
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  
  tabIcon: {
    marginRight: spacing.xs,
  },
  
  activeTabButton: {
    // Style updated to be more subtle
  },
  
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  
  activeTabText: {
    fontWeight: "600",
  },
  
  // New animated indicator
  tabIndicator: {
    height: 3,
    position: "absolute",
    bottom: -1, // Position it right at the bottom border
    left: 0,
    borderRadius: 1.5,
  },
  
  // Adjusted gallery content area
  galleryContent: {
    flex: 1,
    paddingTop: spacing.md, // Add some spacing between tabs and content
  },
  
  scrollContent: {
    flexGrow: 1,
  },
  
  // Empty states
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.xxl,
  },
  
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing.md,
  },
  
  emptyButton: {
    marginTop: spacing.lg,
  },
});