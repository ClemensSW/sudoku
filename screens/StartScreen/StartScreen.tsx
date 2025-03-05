import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Animated,
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/utils/theme";
import { Difficulty } from "@/utils/sudoku";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";

import Button from "@/components/Button/Button";
import DifficultySelector from "@/components/DifficultySelector/DifficultySelector";
import styles from "./StartScreen.styles";

const StartScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;

  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [fadeAnim] = useState(new Animated.Value(0));

  // Animations when screen loads
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleStartGame = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/(game)",
      params: { difficulty: selectedDifficulty },
    });
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="auto" />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Sudoku
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Trainiere dein Gehirn mit Logik-Rätseln
          </Text>
        </View>

        <View style={styles.logoContainer}>
          {/* Hier könnte ein Logo oder Illustration sein */}
          <View
            style={[
              styles.logoPlaceholder,
              { backgroundColor: colors.primary },
            ]}
          >
            {/* 3x3 Grid for visual representation of Sudoku */}
            <View style={styles.gridContainer}>
              {Array.from({ length: 9 }).map((_, index) => (
                <View
                  key={index}
                  style={[styles.gridCell, { borderColor: colors.buttonText }]}
                >
                  {[2, 4, 6, 8].includes(index) && (
                    <Text
                      style={[styles.gridNumber, { color: colors.buttonText }]}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.difficultyContainer}>
          <Text style={[styles.difficultyTitle, { color: colors.textPrimary }]}>
            Wähle eine Schwierigkeitsstufe:
          </Text>
          <DifficultySelector
            currentDifficulty={selectedDifficulty}
            onSelectDifficulty={handleDifficultyChange}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Spielen"
            onPress={handleStartGame}
            variant="primary"
            style={styles.startButton}
          />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

export default StartScreen;
