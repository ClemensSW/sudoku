// components/LevelProgress/LevelProgress.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  // Haupt-Container
  container: {
    width: "100%",
    borderRadius: 16,
    padding: 16,
    paddingBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
  },
  
  // Kompakter Container mit weniger Padding
  compactContainer: {
    padding: 12,
    paddingBottom: 12,
  },
  
  // XP-Gewinn-Badge (NEU)
  xpGainBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  
  xpGainText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 4,
  },
  
  // Header-Bereich mit Badge und Level-Info
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  
  // Level-Informationen Container
  levelInfoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  
  // Level-Name
  levelName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  
  // Level-Nachricht (Beschreibung)
  levelMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  
  // Container für PathInfo für besseres Spacing
  pathInfoContainer: {
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1, // Trennstrich für visuelle Trennung
  },
  
  // Fortschrittsbereich
  progressSection: {
    marginTop: 4,
  },
  
  // XP-Informationszeile
  xpInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  
  // XP-Text
  xpText: {
    fontSize: 16,
    fontWeight: "600",
  },
  
  // Verbesserte XP-Beschriftung
  xpLabel: {
    fontWeight: "500",
    fontSize: 14,
  },
  
  // Text für benötigte XP bis zum nächsten Level
  xpToGo: {
    fontSize: 13,
    opacity: 0.8,
  },
  
  // Container für den Fortschrittsbalken
  progressBarContainer: {
    height: 8,
    width: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  
  // Hintergrund des Fortschrittbalkens
  progressBackground: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
    overflow: "hidden",
  },
  
  // Gefüllter Teil des Fortschrittsbalkens
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  
  // Container für Meilenstein-Nachrichten
  milestoneContainer: {
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  
  // Text für Meilenstein-Nachrichten
  milestoneText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  
  // Overlay für Level-Up-Animation
  levelUpOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
    zIndex: 10,
  },
  
  // Container für Level-Up-Inhalt
  levelUpContent: {
    alignItems: "center",
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: "80%",
  },
  
  // "Level Up!"-Text
  levelUpText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  
  // Name des neuen Levels
  newLevelName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 16,
    textAlign: "center",
  },
  
  // Nachricht des neuen Levels
  newLevelMessage: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginTop: 8,
    textAlign: "center",
    lineHeight: 22,
  },
});