// screens/DuoScreen/components/DuoFeatures/DuoFeatures.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./DuoFeatures.styles";

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface DuoFeaturesProps {
  onStartGame: () => void;
}

const DuoFeatures: React.FC<DuoFeaturesProps> = ({ onStartGame }) => {
  const theme = useTheme();
  const colors = theme.colors;

  const features: Feature[] = [
    {
      icon: "users",
      title: "Gemeinsam spielen",
      description: "Ein Gerät, zwei Spieler - wer löst sein Gebiet zuerst?",
      color: colors.primary,
    },
    {
      icon: "rotate-ccw",
      title: "Intelligentes Layout",
      description: "Zahlen für Spieler 2 werden automatisch gedreht",
      color: colors.warning,
    },
    {
      icon: "target",
      title: "Strategie & Teamwork",
      description: "Wettbewerb oder Zusammenarbeit - ihr entscheidet!",
      color: colors.success,
    },
    {
      icon: "refresh-cw",
      title: "Perfekt für Spieleabende",
      description: "Völlig neues Sudoku-Erlebnis mit deinen Freunden",
      color: colors.secondary,
    },
  ];

  return (
    <View style={styles.featuresContainer}>
      <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>
        So funktioniert's
      </Text>

      {features.map((feature, index) => (
        <Animated.View
          key={`feature-${index}`}
          style={[styles.featureCard, { backgroundColor: colors.surface }]}
          entering={FadeInUp.delay(300 + index * 100).duration(500)}
        >
          <View
            style={[
              styles.featureIcon,
              { backgroundColor: `${feature.color}15` },
            ]}
          >
            <Feather name={feature.icon as any} size={22} color={feature.color} />
          </View>
          <View style={styles.featureContent}>
            <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
              {feature.title}
            </Text>
            <Text
              style={[styles.featureDescription, { color: colors.textSecondary }]}
            >
              {feature.description}
            </Text>
          </View>
        </Animated.View>
      ))}

      <Animated.View
        style={styles.buttonContainer}
        entering={FadeInUp.delay(700).duration(500)}
      >
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: colors.primary }]}
          onPress={onStartGame}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Spiel starten</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default DuoFeatures;