import React from "react";
import { View } from "react-native";
import ProfileSettingsScreen from "@/screens/Settings/screens/ProfileSettingsScreen";

export default function ProfileSettingsRoute() {
  return (
    <View style={{ flex: 1 }}>
      <ProfileSettingsScreen />
    </View>
  );
}
