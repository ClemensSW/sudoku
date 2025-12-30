import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width } = Dimensions.get("window");

// Berechne optimale Kartengröße basierend auf Bildschirmbreite
// 2 Karten pro Zeile mit Abstand dazwischen
const CARD_MARGIN = spacing.sm;
const CARDS_PER_ROW = 2;
const CARD_WIDTH = (width - spacing.xl * 2 - CARD_MARGIN * (CARDS_PER_ROW - 1)) / CARDS_PER_ROW;
const CARD_HEIGHT = CARD_WIDTH * 1.25; // Seitenverhältnis 4:5 für die Karten

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    // paddingTop moved to FlatList contentContainerStyle for proper scroll clipping
  },
  
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  
  // Item-Styles - Enhanced with better shadows
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    // Enhanced shadow for more depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  
  // New styles for placeholder image handling
  placeholderImage: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  
  blurredImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  
  placeholderIconContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  
  placeholderText: {
    marginTop: spacing.sm,
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    textAlign: "center",
  },
  
  // New gradient overlay for better readability
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "50%", // Cover about half the image height
  },
  
  // Status badge
  statusBadge: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  
  badgeIcon: {
    marginRight: 4,
  },

  badgeIconNoText: {
    marginRight: -2,
  },
  
  badgeText: {
    color: "#FFFFFF",
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
  },
  
  // Enhanced info area with better readability
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    paddingBottom: spacing.md,
  },
  
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  category: {
    // fontSize set dynamically via theme.typography
    color: "rgba(255, 255, 255, 0.8)",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  
  emptyText: {
    // fontSize set dynamically via theme.typography
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },

  // Neues Badge für das aktuelle Projekt
  currentProjectBadge: {
    position: "absolute",
    top: spacing.sm,
    left: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: 12,
    backgroundColor: "rgba(66, 133, 244, 0.9)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgba(0, 0, 0, 0.5)",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
});