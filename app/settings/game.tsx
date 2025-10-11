import React from "react";
import { View } from "react-native";
import GameSettingsScreen from "@/screens/Settings/screens/GameSettingsScreen";

export default function GameSettingsRoute() {
  return (
    <View style={{ flex: 1 }}>
      <GameSettingsScreen />
    </View>
  );
}
