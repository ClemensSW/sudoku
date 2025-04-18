// app/(game)/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";

export default function GameLayout() {
  const theme = useTheme();
  const { colors } = theme;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        animationDuration: 200, // Schnellerer Übergang
        contentStyle: { 
          backgroundColor: colors.background // Konsistente Hintergrundfarbe
        },
      }}
    />
  );
}