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
    paddingHorizontal: spacing.xl, // Increased padding for better visual spacing
    paddingTop: spacing.md, // Added top padding to create space from the tabs
  },
  
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  
  // Item-Styles
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    marginBottom: spacing.lg,
    borderRadius: radius.lg,
    overflow: "hidden",
    // Enhanced shadow for more depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5, // Increased elevation for better visibility
  },
  
  // Nur bei Bildern in Arbeit
  progressOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  
  // Info-Bereich unten auf der Karte
  infoContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.sm,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(2px)",
  },
  
  title: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  
  category: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  
  // Badges
  badgeContainer: {
    position: "absolute",
    top: spacing.xs,
    right: spacing.xs,
    flexDirection: "row",
  },
  
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: radius.xs,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    marginLeft: spacing.xs,
  },
  
  progressText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 2,
  },
  
  favoriteButton: {
    position: "absolute",
    top: spacing.xs,
    left: spacing.xs,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  
  // Leere Galerie
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
  
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  
  // Lade-Indikator
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.xxl,
  },
});