// app/_layout.tsx
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/utils/theme/ThemeProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

export default function AppLayout() {
  useEffect(() => {
    // Verstecke die Navigationsleiste auf Android
    if (Platform.OS === "android") {
      // Diese Zeile versteckt die untere Navigationsleiste
      NavigationBar.setVisibilityAsync("hidden");
      // Falls du die Leiste trotzdem manchmal benötigst, kannst du sie transparent machen
      NavigationBar.setBackgroundColorAsync("transparent");
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          {/* Statusleiste komplett ausblenden */}
          <StatusBar hidden={true} />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              contentStyle: { backgroundColor: "transparent" }, // Prevents white flash during transitions
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="game" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="(game)" />
          </Stack>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
