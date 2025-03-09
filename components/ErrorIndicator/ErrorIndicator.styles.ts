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
});
