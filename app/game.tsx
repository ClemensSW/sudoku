import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Difficulty } from "@/utils/sudoku";

export default function GameRedirect() {
  const params = useLocalSearchParams<{ difficulty?: string }>();
  const difficulty = params.difficulty as Difficulty | undefined;
  const router = useRouter();

  useEffect(() => {
    // Korrigierter Routenpfad: ohne führenden Schrägstrich
    const route = difficulty
      ? { pathname: "(game)", params: { difficulty } }
      : "(game)";

    router.replace(route);
  }, [difficulty, router]);

  // Zeige nichts an während der Weiterleitung
  return null;
}
