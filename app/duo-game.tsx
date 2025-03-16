// app/duo-game.tsx
import React from "react";
import { useLocalSearchParams } from "expo-router";
import DuoGameScreen from "@/screens/DuoGameScreen/DuoGameScreen";
import { Difficulty } from "@/utils/sudoku";

export default function DuoGame() {
  const params = useLocalSearchParams<{ difficulty?: string }>();
  const difficulty = params.difficulty as Difficulty | undefined;

  console.log("DuoGame route: Receiving difficulty parameter:", difficulty);

  return <DuoGameScreen initialDifficulty={difficulty || "medium"} />;
}