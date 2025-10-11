import React from "react";
import { View } from "react-native";
import DesignSettingsScreen from "@/screens/Settings/screens/DesignSettingsScreen";

export default function DesignSettingsRoute() {
  return (
    <View style={{ flex: 1 }}>
      <DesignSettingsScreen />
    </View>
  );
}
