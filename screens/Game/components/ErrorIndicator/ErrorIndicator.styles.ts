import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },

  heartsContainerBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 20,
    minWidth: 44,
    minHeight: 44,
    position: "relative",
    overflow: "hidden",
  },

  containerBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },

  heartsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  heartContainer: {
    marginHorizontal: 2,
  },

  // Stil für das Unendlichkeitssymbol
  infinityText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: -3, // Leicht angepasst für bessere vertikale Ausrichtung
  },
});
