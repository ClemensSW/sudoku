// components/BottomNavigation/NavItem.tsx
import React, { memo } from "react";
import { Pressable, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { NavItemProps } from "./types";
import { styles } from "./NavItem.styles";
import { ICON_SIZE } from "./constants";

const NavItem: React.FC<NavItemProps> = memo(
  ({ tab, isActive, activeColor, inactiveColor, indicatorColor, onPress }) => {
    const { t } = useTranslation("common");

    // M3 Pill Indicator Animation
    const indicatorStyle = useAnimatedStyle(() => ({
      transform: [
        { scaleX: withTiming(isActive ? 1 : 0, { duration: 150 }) },
      ],
      opacity: withTiming(isActive ? 1 : 0, { duration: 150 }),
    }));

    const color = isActive ? activeColor : inactiveColor;
    const iconName = isActive ? tab.iconFilled : tab.iconOutline;

    return (
      <Pressable style={styles.tab} onPress={onPress}>
        <View style={styles.iconContainer}>
          {/* M3 Pill Indicator */}
          <Animated.View
            style={[
              styles.indicator,
              { backgroundColor: indicatorColor },
              indicatorStyle,
            ]}
          />

          {/* Icon */}
          <Ionicons name={iconName} size={ICON_SIZE} color={color} />
        </View>

        {/* Label */}
        <Text
          style={[
            styles.label,
            {
              color,
              fontWeight: isActive ? "600" : "400",
            },
          ]}
        >
          {t(tab.labelKey)}
        </Text>
      </Pressable>
    );
  }
);

NavItem.displayName = "NavItem";

export default NavItem;
