import React from "react";
import { useLocalSearchParams } from "expo-router";
import GameScreen from "@/screens/Game/Game";
import { Difficulty } from "@/utils/sudoku";

export default function GameRoute() {
  const params = useLocalSearchParams<{ difficulty?: string; resume?: string }>();
  const difficulty = params.difficulty as Difficulty | undefined;
  const shouldResume = params.resume === "true";

  return <GameScreen initialDifficulty={difficulty} shouldResume={shouldResume} />;
}
