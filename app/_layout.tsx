// app/_layout.tsx
import React, { useEffect, useState, createContext, useContext } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Slot, Stack, usePathname } from "expo-router";
import { ThemeProvider, useTheme } from "@/utils/theme/ThemeProvider";
import { AlertProvider } from "@/components/CustomAlert/AlertProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, View, StyleSheet } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

// Direkter Context für Navigation-Kontrolle
type NavigationContextType = {
  hideBottomNav: boolean;
  setHideBottomNav: (hide: boolean) => void;
};

const NavigationContext = createContext<NavigationContextType>({
  hideBottomNav: false,
  setHideBottomNav: () => {},
});

export const useNavigationControl = () => useContext(NavigationContext);

// Separater Container, um auf den Theme-Context zugreifen zu können
function AppContainer() {
  const pathname = usePathname();
  const theme = useTheme();
  const { colors } = theme;

  // State für die Navigation-Kontrolle
  const [hideBottomNav, setHideBottomNav] = useState(false);

  useEffect(() => {
    // Hide navigation bar on Android for cleaner look
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBackgroundColorAsync("transparent");
    }
  }, []);

  // Verstecke Navigation auf bestimmten Seiten automatisch
  useEffect(() => {
    // Debug-Info hinzufügen
    console.log("Current pathname:", pathname);
    
    // Game-spezifische Erkennung
    const isGameScreen = 
      pathname === "/game" || 
      pathname === "/(game)" || 
      pathname?.startsWith("/game") || 
      pathname?.startsWith("/(game)") ||
      pathname?.includes("game");
      
    // Gallery-spezifische Erkennung (NEU)
    const isGalleryScreen = 
      pathname === "/gallery" || 
      pathname?.startsWith("/gallery");
      
    // Andere Screens, die Navigation verstecken sollten
    const isOtherHiddenScreen = 
      pathname === "/settings" || 
      pathname?.startsWith("/settings") ||
      pathname === "/duo-game" || 
      pathname?.startsWith("/duo-game");
    
    // Navigation verstecken, wenn wir auf einem dieser Screens sind
    const shouldHideNav = isGameScreen || isGalleryScreen || isOtherHiddenScreen;
    console.log("Should hide nav:", shouldHideNav, 
                "isGameScreen:", isGameScreen, 
                "isGalleryScreen:", isGalleryScreen);
    
    setHideBottomNav(shouldHideNav);
  }, [pathname]);

  // Feste Hintergrundfarbe basierend auf dem Theme
  const containerStyle = {
    backgroundColor: theme.isDark ? "#202124" : "#F8F9FA", // Fest kodierte Farben anstatt theme.colors.background
    flex: 1,
  };

  return (
    <NavigationContext.Provider value={{ hideBottomNav, setHideBottomNav }}>
      {/* View mit fester Hintergrundfarbe, um Flackern zu vermeiden */}
      <View style={containerStyle}>
        {/* StatusBar konsistent ausblenden */}
        <StatusBar hidden={true} />

        {/* Stack Navigator mit identischer Hintergrundfarbe */}
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "none", // Keine Animation, um Flackern zu vermeiden
            contentStyle: containerStyle, // WICHTIG: Exakt dieselbe Farbe wie der Container
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="game" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="(game)" />
          <Stack.Screen name="duo" />
          <Stack.Screen name="leistung" />
          <Stack.Screen name="gallery" />
          <Stack.Screen name="duo-game" />
        </Stack>

        {/* Bottom Navigation */}
        {!hideBottomNav && <BottomNavigation />}
      </View>
    </NavigationContext.Provider>
  );
}

export default function AppLayout() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AlertProvider>
            <AppContainer />
          </AlertProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
});