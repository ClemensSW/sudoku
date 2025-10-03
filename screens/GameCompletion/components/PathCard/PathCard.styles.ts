// components/GameCompletion/components/PathCard/PathCard.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  // Main Card
  card: {
    width: "100%",
    borderRadius: radius.xl,
    padding: spacing.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },

  // Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerIconWrap: {
    width: 72,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  // Trail
  trailContainer: {
    width: "100%",
    height: 120,
    marginTop: 2,
    marginBottom: spacing.lg,
  },

  // Path Details Card
  pathDetailsCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },

  pathDetailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  pathDetailsHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  pathDetailsHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  pathColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },

  descriptionTitle: {
    fontSize: 15.5,
    fontWeight: "800",
  },

  descriptionBody: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 10,
    borderLeftWidth: 3,
  },

  descriptionText: {
    fontSize: 14.5,
    lineHeight: 21,
  },
});
