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
    paddingBottom: 16,
    paddingTop: 16,
    paddingHorizontal: spacing.md,
    flexDirection: "row",
    justifyContent: "center", // Zentriert für Shifting Labels
    alignItems: "center",
    gap: 8, // Abstand zwischen Tabs
    position: "relative",
    borderTopWidth: 1,
  },

  // Basis-Style für alle Tabs
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 22, // Pill-Shape
    minHeight: 44,
  },

  // Inactive Tab: nur Icon, feste Breite
  inactiveTabButton: {
    width: 48,
    paddingHorizontal: 0,
  },

  // Active Tab: Icon + Text, flexible Breite
  activeTabButton: {
    paddingHorizontal: 16,
    gap: 6, // Abstand zwischen Icon und Text
  },

  tabText: {
    // fontSize set dynamically via theme.typography
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