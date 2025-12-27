// screens/Duo/components/GameModeCard/GameModeCard.styles.ts
import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    marginBottom: spacing.md,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.lg,
  },

  content: {
    flex: 1,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: 0.2,
  },

  description: {
    fontSize: 14,
    fontWeight: "500",
    opacity: 0.8,
  },

  chevron: {
    marginLeft: spacing.sm,
  },
});
