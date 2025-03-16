// components/BottomNavigation/BottomNavigation.tsx
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useRouter, usePathname } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { triggerHaptic } from "@/utils/haptics";

interface BottomNavigationProps {
  // Optional: für bestimmte Szenarien können wir die Navigation explizit ausblenden
  visible?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  visible = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  // Bestimme auf welchen Routen die Navigation angezeigt werden soll - alles andere ist ausgeblendet
  const shouldShowNavigation = () => {
    // Nur für diese spezifischen Hauptrouten anzeigen
    const allowedPaths = ["/", "/index", "/duo", "/leistung"];
    return visible && allowedPaths.includes(pathname);
  };

  // Navigation vollständig ausblenden, wenn sie nicht angezeigt werden soll
  if (!shouldShowNavigation()) {
    return null;
  }

  const tabs = [
    {
      name: "Home",
      path: "/",
      icon: "home",
    },
    {
      name: "Duo",
      path: "/duo",
      icon: "users",
    },
    {
      name: "Leistung",
      path: "/leistung",
      icon: "award",
    },
  ];

  const handleTabPress = (path: string) => {
    if (pathname !== path) {
      triggerHaptic("light");
      router.push(path);
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: theme.isDark ? colors.card : colors.surface,
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopColor: theme.isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
        },
      ]}
      entering={FadeIn.duration(300)}
    >
      {tabs.map((tab) => {
        const isActive =
          tab.path === "/"
            ? pathname === "/" || pathname === "/index"
            : pathname === tab.path;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            onPress={() => handleTabPress(tab.path)}
            activeOpacity={0.7}
          >
            <View style={styles.tabContent}>
              <Feather
                name={tab.icon as any}
                size={22}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text
                style={[
                  styles.tabLabel,
                  {
                    color: isActive ? colors.primary : colors.textSecondary,
                    fontWeight: isActive ? "600" : "400",
                  },
                ]}
              >
                {tab.name}
              </Text>
            </View>
            {isActive && (
              <View
                style={[
                  styles.activeIndicator,
                  { backgroundColor: colors.primary },
                ]}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    borderTopWidth: 1,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    position: "relative",
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    position: "absolute",
    bottom: 0,
  },
});

export default BottomNavigation;
