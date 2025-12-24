// components/BottomNavigation/NavItem.styles.ts
import { StyleSheet } from "react-native";
import {
  LABEL_SIZE,
  INDICATOR_WIDTH,
  INDICATOR_HEIGHT,
  INDICATOR_RADIUS,
} from "./constants";

export const styles = StyleSheet.create({
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  iconContainer: {
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  indicator: {
    position: "absolute",
    width: INDICATOR_WIDTH,
    height: INDICATOR_HEIGHT,
    borderRadius: INDICATOR_RADIUS,
  },
  label: {
    fontSize: LABEL_SIZE,
    marginTop: 4,
    letterSpacing: 0.2,
  },
});
