// app/_layout.tsx
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Slot, Stack, usePathname } from "expo-router";
import { ThemeProvider } from "@/utils/theme/ThemeProvider";
import { AlertProvider } from "@/components/CustomAlert/AlertProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";

export default function AppLayout() {
  const pathname = usePathname();

  useEffect(() => {
    // Hide navigation bar on Android for cleaner look
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBackgroundColorAsync("transparent");
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AlertProvider>
            {/* Hide status bar for cleaner look */}
            <StatusBar hidden={true} />
            <View style={{ flex: 1 }}>
              <Stack
                screenOptions={{
                  headerShown: false, // Hide header
                  animation: "fade", // Use fade animation for transitions
                  contentStyle: { backgroundColor: "transparent" }, // Transparent background
                  animationDuration: 300, // Smooth animation
                }}
              >
                <Stack.Screen name="index" />
                <Stack.Screen name="game" />
                <Stack.Screen name="settings" />
                <Stack.Screen name="(game)" />
                <Stack.Screen name="duo" />
                <Stack.Screen name="leistung" />
              </Stack>

              {/* Bottom Navigation - nur auf Hauptrouten anzeigen */}
              <BottomNavigation />
            </View>
          </AlertProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
