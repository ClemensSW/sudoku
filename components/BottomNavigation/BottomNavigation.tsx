// components/BottomNavigation/BottomNavigation.tsx
import React, { useCallback } from "react";
import { useRouter, usePathname } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { triggerHaptic } from "@/utils/haptics";
import { useProgressColor } from "@/hooks/useProgressColor";
import NavItem from "./NavItem";
import { NAV_TABS, NAV_HEIGHT } from "./constants";
import { styles } from "./BottomNavigation.styles";

// Duo Color - Darkened Silver (matches current league, more visible than pure silver)
const DUO_COLOR = "#989898";

const BottomNavigation: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const progressColor = useProgressColor();

  const isTabActive = useCallback(
    (tabPath: string): boolean => {
      if (tabPath === "/") {
        return pathname === "/" || pathname === "/index";
      }
      if (tabPath === "/duo") {
        return pathname === "/duo" || pathname.startsWith("/duo-online") || pathname === "/duo-game";
      }
      return pathname === tabPath;
    },
    [pathname]
  );

  const handleTabPress = useCallback(
    (path: string) => {
      if (pathname !== path) {
        triggerHaptic("light");
        router.push({ pathname: path as any });
      }
    },
    [pathname, router]
  );

  // M3 Indicator color: 12% opacity of primary color
  const indicatorColor = `${progressColor}1F`; // 1F = ~12% opacity in hex

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.isDark ? colors.card : colors.surface,
          height: NAV_HEIGHT + Math.max(insets.bottom, 8),
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopColor: theme.isDark
            ? "rgba(255,255,255,0.15)"
            : "rgba(0,0,0,0.12)",
        },
      ]}
      entering={FadeIn.duration(300)}
    >
      {NAV_TABS.map((tab) => {
        // Use fixed DUO_COLOR for Duo tab
        const tabActiveColor = tab.key === "duo" ? DUO_COLOR : progressColor;
        const tabIndicatorColor = tab.key === "duo" ? `${DUO_COLOR}1F` : indicatorColor;

        return (
          <NavItem
            key={tab.key}
            tab={tab}
            isActive={isTabActive(tab.path)}
            activeColor={tabActiveColor}
            inactiveColor={colors.textSecondary}
            indicatorColor={tabIndicatorColor}
            onPress={() => handleTabPress(tab.path)}
          />
        );
      })}
    </Animated.View>
  );
};

export default BottomNavigation;
