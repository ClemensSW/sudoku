import React from "react";
import { View, Text } from "react-native";
import Settings from "@/screens/Settings/Settings";
import { useRouter } from "expo-router";

export default function SettingsRoute() {
  console.log("Settings screen rendering");
  const router = useRouter();

  const handleBack = () => {
    console.log("Back button pressed in settings");
    router.back();
  };

  return (
    <View style={{ flex: 1 }}>
      <Settings onBackToGame={handleBack} fromGame={false} />
    </View>
  );
}
