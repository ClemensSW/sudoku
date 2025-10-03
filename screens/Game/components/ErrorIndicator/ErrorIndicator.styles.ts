import { StyleSheet } from "react-native";
import { spacing } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xs,
  },

  heartsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  heartContainer: {
    marginHorizontal: 3,
  },

  // Stil für das Unendlichkeitssymbol
  infinityText: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: -3, // Leicht angepasst für bessere vertikale Ausrichtung
  },
});
