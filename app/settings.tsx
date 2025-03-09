import React from "react";
import SettingsScreen from "@/screens/SettingsScreen/SettingsScreen";
import { useRouter } from "expo-router";

export default function SettingsRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleQuit = () => {
    router.replace("/");
  };

  return <SettingsScreen onBackToGame={handleBack} onQuitGame={handleQuit} />;
}
