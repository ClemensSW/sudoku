import React from "react";
import { Stack } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";

export default function GameLayout() {
  const theme = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: "fade",
      }}
    />
  );
}
