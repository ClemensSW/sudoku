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
    minHeight: 220, // Etwas mehr Höhe für den Inhalt
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
    fontSize: 28,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10, // Mehr Abstand zur Beschreibung
  },
  description: {
    fontSize: 14, // Größer für bessere Lesbarkeit
    lineHeight: 18,
    textAlign: "center",
    marginBottom: 16,
    minHeight: 54, // Mehr Platz für Text
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
    fontSize: 16,
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
    fontSize: 11,
    fontWeight: "700",
  },
  shine: {
    position: "absolute",
    width: 60,
    height: 200,
    transform: [{ rotate: "25deg" }, { translateX: -100 }],
  },
});
