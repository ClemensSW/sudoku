import React from "react";
import SettingsScreen from "@/screens/SettingsScreen/SettingsScreen";
import { useRouter } from "expo-router";

export default function SettingsRoute() {
  const router = useRouter();
  
  const handleBack = () => {
    router.back();
  };

  return (
    <SettingsScreen 
      onBackToGame={handleBack}
      // No onQuitGame or onAutoNotes props when opened from start screen
      fromGame={false}
    />
  );
}