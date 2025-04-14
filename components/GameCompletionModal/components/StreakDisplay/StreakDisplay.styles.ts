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
  
  recordBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: radius.md,
  },
  
  recordText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 4,
  },
  
  // Streak Flames
  flamesContainer: {
    flexDirection: "row",
    justifyContent: "center", 
    alignItems: "center",
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  
  flameIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 4,
  },
  
  streakCountText: {
    fontSize: 18,
    fontWeight: "700",
    marginLeft: spacing.sm,
  },
  
  // Progress bar
  progressContainer: {
    width: "100%",
    marginTop: spacing.xs,
  },
  
  progressBackground: {
    width: "100%",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  
  progressFill: {
    height: "100%",
    borderRadius: 4,
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
  
  streakValue: {
    fontSize: 12,
    fontWeight: "600",
  },
});