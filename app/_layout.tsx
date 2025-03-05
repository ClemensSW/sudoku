import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/utils/theme/ThemeProvider";

export default function AppLayout() {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#ffffff" }, // Default white background
          animation: "fade",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="game" />
        <Stack.Screen name="(game)" />
      </Stack>
    </ThemeProvider>
  );
}
