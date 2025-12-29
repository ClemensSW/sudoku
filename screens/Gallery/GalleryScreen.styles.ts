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
  
  // Filter Badge Styles
  filterBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    borderRadius: radius.xl,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  
  filterBadgeText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    marginLeft: spacing.xs,
    flex: 1,
  },
  
  filterClearButton: {
    marginLeft: spacing.sm,
    padding: spacing.xxs,
  },
  
  // Bottom Tab Container - neu für untere Navigation
  bottomTabContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  
  // Tab-Container Styles aktualisiert für untere Position
  tabsContainerWrapper: {
    width: "100%",
    shadowOffset: { width: 0, height: -2 }, // Schatten nach oben statt nach unten
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
    zIndex: 10,
    borderTopWidth: 1, // Obere Grenze statt untere
  },
  
  tabsContainer: {
    paddingBottom: 12,
    paddingTop: 12,
    paddingHorizontal: spacing.sm, // 8px - consistent with AvatarPicker
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative", // For absolute positioning of the indicator
    borderTopWidth: 1, // Obere Grenze statt untere
  },
  
  tabButton: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // Mehr Größe für bessere Touch-Targets
    minHeight: 44,
    // Make it expand to fill available space
    flex: 1,
    marginHorizontal: 2, // Small margin between tabs
  },
  
  // New compact mode styles for very small screens
  compactTabButton: {
    paddingHorizontal: spacing.xs,
    minHeight: 40,
  },
  
  // New styles for small screens
  smallTabButton: {
    paddingHorizontal: spacing.xs,
  },
  
  smallTabText: {
    // fontSize set dynamically via theme.typography (smaller for small screens)
  },
  
  tabIcon: {
    marginRight: spacing.xs,
  },
  
  activeTabButton: {
    // Style updated to be more subtle
  },
  
  tabText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "500",
    textAlign: 'center',
  },
  
  activeTabText: {
    fontWeight: "600",
  },
  
  // Aktualisierter Tab-Indikator, der jetzt oben statt unten angezeigt wird
  tabIndicator: {
    height: 3,
    position: "absolute",
    top: -1, // Position direkt an der oberen Grenze
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
    // fontSize set dynamically via theme.typography
    textAlign: "center",
    marginTop: spacing.md,
  },
  
  emptyButton: {
    marginTop: spacing.lg,
  },
});