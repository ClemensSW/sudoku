// app/_layout.tsx
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/utils/theme/ThemeProvider";
import { AlertProvider } from "@/components/CustomAlert/AlertProvider";
import { NavigationProvider, useNavigation } from "@/contexts/navigation";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, View, StyleSheet } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

/**
 * App Container - Main Layout Component
 * Handles theme-dependent styling and navigation rendering
 */
function AppContainer() {
  const theme = useTheme();
  const { isBottomNavVisible, currentRoute } = useNavigation();

  // DEBUG LOG
  console.log('[AppContainer] Rendering with:', {
    currentRoute,
    isBottomNavVisible,
  });

  // Configure Android Navigation Bar
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBackgroundColorAsync("transparent");
    }
  }, []);

  // Theme-based background color
  const containerStyle = {
    backgroundColor: theme.isDark ? "#202124" : "#F8F9FA",
    flex: 1,
  };

  return (
    <View style={containerStyle}>
      <StatusBar hidden={true} />

      {/* Stack Navigator */}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: containerStyle,
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

      {/* Bottom Navigation - Conditionally Rendered */}
      {isBottomNavVisible && <BottomNavigation />}
    </View>
  );
}

/**
 * App Layout - Root Component
 * Sets up all providers in the correct order
 */
export default function AppLayout() {
  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <ThemeProvider>
          <NavigationProvider>
            <AlertProvider>
              <AppContainer />
            </AlertProvider>
          </NavigationProvider>
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