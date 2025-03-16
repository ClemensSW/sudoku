// app/index.tsx
import React from "react";
import StartScreen from "@/screens/StartScreen/StartScreen";

export default function Index() {
  // Direkter Aufruf der Startseite ohne Umweg über den LoadingScreen
  return <StartScreen />;
}
