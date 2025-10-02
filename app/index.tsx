// app/index.tsx
import React from "react";
import Start from "@/screens/Start/Start";

export default function Index() {
  // Direkter Aufruf der Startseite ohne Umweg über den LoadingScreen
  return <Start />;
}
