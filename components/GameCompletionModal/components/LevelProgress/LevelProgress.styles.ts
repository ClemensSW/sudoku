import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.md,
    paddingBottom: spacing.lg,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  
  xpGainBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.md,
  },
  
  xpGainText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  
  // Level Display
  levelInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.md,
    marginRight: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  
  levelNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  
  levelNameContainer: {
    flex: 1,
  },
  
  levelName: {
    fontSize: 18,
    fontWeight: "700",
  },
  
  levelDescription: {
    fontSize: 12,
    marginTop: 2,
  },
  
  // Progress bar
  progressContainer: {
    width: "100%",
    marginTop: spacing.xs,
  },
  
  progressBackground: {
    width: "100%",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  
  progressFill: {
    height: "100%",
    borderRadius: 6,
  },
  
  // Anzeige des Gewinns und Marker für nächstes Level
  progressGainIndicator: {
    position: "absolute",
    top: 0,
    height: "100%",
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  
  progressLabelContainer: {
    marginTop: spacing.xs,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  progressLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  
  xpValues: {
    fontSize: 12,
    fontWeight: "600",
  },
  
  // Animation für Levelaufstieg
  levelUpContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: radius.xl,
    zIndex: 10,
  },
  
  levelUpContent: {
    alignItems: "center",
    padding: spacing.lg,
  },
  
  levelUpText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: spacing.md,
  },
  
  newLevelText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: spacing.md,
  },
});