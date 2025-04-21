import { StyleSheet, Dimensions } from "react-native";
import { spacing, radius } from "@/utils/theme";

const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  // Modal-Overlays
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // Hintergrundfarbe wird dynamisch über props gesetzt
  },
  
  // Modal-Container
  modalContainer: {
    width: "100%", 
    height: "100%",
    justifyContent: "space-between",
  },
  
  // Header-Bereich
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    zIndex: 10,
  },
  
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 5,
  },
  
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  favoriteButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  // Hauptbild-Bereich
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  
  // Neue Stile für den Platzhalter
  placeholderContainer: {
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
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  
  placeholderContent: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    width: "80%",
    maxWidth: 320,
  },
  
  progressText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginTop: spacing.md,
  },
  
  progressBarContainer: {
    width: "100%",
    marginTop: spacing.md,
  },
  
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
  },
  
  progressHint: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    textAlign: "center",
    marginTop: spacing.md,
  },
  
  // Fortschritts-Anzeige für unvollständige Bilder
  progressOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  
  // Grid-Overlay für Segmente
  gridOverlay: {
    position: "absolute",
    top: "15%",  // Zentriert im Bildschirm
    left: "10%",
    right: "10%",
    height: width * 0.8, // Quadratisches Raster
    flexDirection: "row",
    flexWrap: "wrap",
  },
  
  segment: {
    width: "33.33%",
    height: "33.33%",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  
  unlockedSegment: {
    // Keine zusätzlichen Styles für freigeschaltete Segmente
  },
  
  lockedSegment: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  
  // Info-Panel am Boden
  infoPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    zIndex: 10,
  },
  
  infoGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    zIndex: 5,
  },
  
  infoContent: {
    marginBottom: spacing.xl, // Mehr Platz für sichere Bereiche auf Geräten
  },
  
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: spacing.xs,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  
  description: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: spacing.md,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Metadaten (Kategorie, Status, etc.)
  metaContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: spacing.md,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.sm,
  },
  
  metaText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 4,
  },
  
  // Umbenannt von progressText zu metaProgressText, um doppelte Namen zu vermeiden
  metaProgressText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginLeft: 4,
    fontWeight: "600",
  },
  
  // Status-Indikator
  completionDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: spacing.sm,
  },
});