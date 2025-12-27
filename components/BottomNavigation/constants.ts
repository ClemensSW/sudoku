// components/BottomNavigation/constants.ts
import { NavTab } from "./types";

export const NAV_TABS: NavTab[] = [
  {
    key: "sudoku",
    path: "/",
    labelKey: "navigation.sudoku",
    iconOutline: "grid-outline",
    iconFilled: "grid",
  },
  {
    key: "duo",
    path: "/duo",
    labelKey: "navigation.duo",
    iconOutline: "people-outline",
    iconFilled: "people",
  },
  {
    key: "performance",
    path: "/leistung",
    labelKey: "navigation.performance",
    iconOutline: "trophy-outline",
    iconFilled: "trophy",
  },
];

// Sizing
export const ICON_SIZE = 24;
export const LABEL_SIZE = 12;
export const NAV_HEIGHT = 80;

// M3 Active Indicator (Pill)
export const INDICATOR_WIDTH = 64;
export const INDICATOR_HEIGHT = 32;
export const INDICATOR_RADIUS = 16;
