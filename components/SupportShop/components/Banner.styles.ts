import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16, // Abstand zum Header
    marginBottom: 24, // Abstand zum nächsten Abschnitt
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000", // Schatten für iOS
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.9, // Stärkere Farben
  },
  content: {
    zIndex: 1,
    paddingRight: 40, // Platz für Emoji
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8, // Mehr Abstand zum Subtitle
    textShadowColor: "rgba(0,0,0,0.3)", // Stärkerer Schatten für bessere Lesbarkeit
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.95)",
    lineHeight: 22,
    textShadowColor: "rgba(0,0,0,0.3)", // Angepasster Schatten
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pattern: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.07,
  },
  emoji: {
    position: "absolute",
    right: 20,
    bottom: 20,
    fontSize: 32,
  },
});
