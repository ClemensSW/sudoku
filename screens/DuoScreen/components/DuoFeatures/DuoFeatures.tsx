// screens/DuoScreen/components/DuoFeatures/DuoFeatures.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
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
  noAnimation?: boolean;
}

const DuoFeatures: React.FC<DuoFeaturesProps> = ({ 
  onStartGame,
  noAnimation = false
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const features: Feature[] = [
    {
      icon: "users",
      title: "Gemeinsam spielen",
      description: "Ein Sudoku, zwei Spieler - wer löst sein Gebiet zuerst?",
      color: "#4A7D78",
    },
    {
      icon: "rotate-ccw",
      title: "Herausforderndes Layout",
      description: "Zahlen für Spieler 2 werden automatisch gedreht",
      color: colors.warning,
    },
    {
      icon: "target",
      title: "Strategie & Teamwork",
      description: "Wettbewerb oder Zusammenarbeit - ihr entscheidet!",
      color: colors.error,
    },
  ];

  return (
    <View style={styles.featuresContainer}>
      <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>
        So funktioniert's
      </Text>

      {features.map((feature, index) => (
        <View
          key={`feature-${index}`}
          style={[styles.featureCard, { backgroundColor: colors.surface }]}
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
        </View>
      ))}

      <View
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          style={[styles.startButton, { backgroundColor: "#4A7D78" }]}
          onPress={onStartGame}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>Spiel starten</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DuoFeatures;