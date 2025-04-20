import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  
  content: {
    flex: 1,
  },
  
  tabsContainer: {
    padding: spacing.md,
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1, // Trennlinie unter den Tabs
  },
  
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  
  activeTabButton: {
    // Die aktive Farbe wird dynamisch gesetzt
  },
  
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
  
  activeTabText: {
    fontWeight: "600",
  },
  
  // Indikator für den aktiven Tab
  activeIndicator: {
    height: 3,
    borderRadius: 1.5,
    position: "absolute",
    bottom: -spacing.xs,
    left: "15%",
    right: "15%",
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