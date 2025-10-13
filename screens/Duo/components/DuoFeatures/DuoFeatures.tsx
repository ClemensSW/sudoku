// screens/DuoScreen/components/DuoFeatures/DuoFeatures.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { getPathColor } from "@/utils/pathColors";
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
  const { t } = useTranslation('duo');
  const theme = useTheme();
  const colors = theme.colors;
  const primaryColor = useProgressColor(); // Dynamic path color

  // Use theme-based colors from path palette
  const greenColor = getPathColor('green', theme.isDark);
  const yellowColor = getPathColor('yellow', theme.isDark);
  const redColor = getPathColor('red', theme.isDark);

  const features: Feature[] = [
    {
      icon: "users",
      title: t('features.items.playTogether.title'),
      description: t('features.items.playTogether.description'),
      color: primaryColor, // Dynamic primary color
    },
    {
      icon: "rotate-ccw",
      title: t('features.items.challengingLayout.title'),
      description: t('features.items.challengingLayout.description'),
      color: yellowColor, // Theme yellow
    },
    {
      icon: "target",
      title: t('features.items.strategyTeamwork.title'),
      description: t('features.items.strategyTeamwork.description'),
      color: redColor, // Theme red
    },
  ];

  return (
    <View style={styles.featuresContainer}>
      <Text style={[styles.featuresTitle, { color: colors.textPrimary }]}>
        {t('features.title')}
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
          style={[styles.startButton, { backgroundColor: primaryColor }]}
          onPress={onStartGame}
          activeOpacity={0.8}
        >
          <Text style={styles.startButtonText}>{t('features.startButton')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DuoFeatures;