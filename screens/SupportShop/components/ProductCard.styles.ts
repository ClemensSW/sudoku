import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // Dynamische Kartenbreite

export default StyleSheet.create({
  container: {
    width: cardWidth - 8,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  innerContainer: {
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon: {
    // fontSize set dynamically via theme.typography
  },
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10, // Mehr Abstand zur Beschreibung
  },
  description: {
    // fontSize set dynamically via theme.typography
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 8,
    minHeight: 36, // Feste Höhe für 2 Zeilen (18 * 2)
    height: 36, // Feste Höhe für konsistente Card-Größe
    flexShrink: 1,
  },
  priceContainer: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  price: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    transform: [{ rotate: "12deg" }],
  },
  popularText: {
    color: "white",
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
  },
  shine: {
    position: "absolute",
    width: 80,
    height: 600, // Deutlich erhöht für vollständige Abdeckung
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    transform: [{ rotate: "25deg" }, { translateX: -100 }],
    top: -200, // Positionierung angepasst
  },
});