// components/BottomNavigation/types.ts
import { Ionicons } from "@expo/vector-icons";

export type IoniconsName = keyof typeof Ionicons.glyphMap;

export interface NavTab {
  key: string;
  path: string;
  labelKey: string;
  iconOutline: IoniconsName;
  iconFilled: IoniconsName;
}

export interface NavItemProps {
  tab: NavTab;
  isActive: boolean;
  activeColor: string;
  inactiveColor: string;
  indicatorColor: string;
  onPress: () => void;
}
