import React, { useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Difficulty } from "@/utils/sudoku";

export default function GameRedirect() {
  const params = useLocalSearchParams<{ difficulty?: string }>();
  const difficulty = params.difficulty as Difficulty | undefined;
  const router = useRouter();

  useEffect(() => {
    // Use separate logic paths for better type safety
    if (difficulty) {
      // When we have a difficulty parameter, use the properly typed object format
      router.replace({
        pathname: "/(game)" as const, // Use 'as const' to ensure literal type
        params: { difficulty },
      });
    } else {
      // Simple string path when no parameters are needed
      router.replace("/(game)");
    }
  }, [difficulty, router]);

  // Show nothing during redirect
  return null;
}
