// components/BottomNavigation/BottomNavigation.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, usePathname, useSegments } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeIn } from "react-native-reanimated";
import { triggerHaptic } from "@/utils/haptics";

interface BottomNavigationProps {
  visible?: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  visible = true,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  // useSegments gibt uns ein Array mit den Teilen des Pfads
  const segments = useSegments();
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const [showNavigation, setShowNavigation] = useState(true);

  // Prüfen, ob die Navigation angezeigt werden soll
  useEffect(() => {
    // Die Hauptrouten, bei denen wir die Navigation anzeigen wollen
    const mainRoutes = ["index", "", "duo", "leistung"];

    // Wenn der erste Teil des Pfads "game" ist oder wenn wir in der (game) Gruppe sind
    const isGameRoute =
      segments.length > 0 &&
      (segments[0] === "game" || segments[0] === "(game)");

    // Prüfen, ob der aktuelle Pfad eine Hauptroute ist
    const isMainRoute =
      segments.length === 1 && mainRoutes.includes(segments[0]);

    // Nur auf Hauptrouten anzeigen und nicht auf Spielrouten
    setShowNavigation(
      visible && !isGameRoute && (isMainRoute || pathname === "/")
    );
  }, [pathname, segments, visible]);

  // Wenn wir die Navigation nicht anzeigen sollen, geben wir null zurück
  if (!showNavigation) {
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
