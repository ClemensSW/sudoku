// app/index.tsx
import React, { useState, useEffect } from "react";
import { View } from "react-native";
import LoadingScreen from "@/screens/LoadingScreen";
import StartScreen from "@/screens/StartScreen/StartScreen";

export default function Index() {
  // Initial loading state beim ersten Render anzeigen
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Kurze Verzögerung, dann zur Startseite wechseln
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1); // 2 Sekunden Ladezeit

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Verwende den modifizierten StartScreen
  return <StartScreen />;
}
