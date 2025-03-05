import React from "react";
import { useLocalSearchParams } from "expo-router";
import GameScreen from "@/screens/GameScreen/GameScreen";
import { Difficulty } from "@/utils/sudoku";

export default function Game() {
  const params = useLocalSearchParams<{ difficulty?: string }>();
  const difficulty = params.difficulty as Difficulty | undefined;

  return <GameScreen initialDifficulty={difficulty} />;
}
