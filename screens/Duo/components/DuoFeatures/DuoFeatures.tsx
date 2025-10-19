// screens/DuoScreen/components/DuoFeatures/DuoFeatures.tsx
import React from "react";
import { View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { getPathColor } from "@/utils/pathColors";
import Button from "@/components/Button/Button";
import styles from "./DuoFeatures.styles";

// SVG Icons
import UnterstutzungIcon from "@/assets/svg/unterstutzung.svg";
import HappyIcon from "@/assets/svg/happy.svg";
import ZielIcon from "@/assets/svg/ziel.svg";

interface Feature {
  icon: React.FC<{ width: number; height: number; fill?: string }>;
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
      icon: UnterstutzungIcon,
      title: t('features.items.playTogether.title'),
      description: t('features.items.playTogether.description'),
      color: primaryColor, // Dynamic primary color
    },
    {
      icon: HappyIcon,
      title: t('features.items.challengingLayout.title'),
      description: t('features.items.challengingLayout.description'),
      color: yellowColor, // Theme yellow
    },
    {
      icon: ZielIcon,
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

      {features.map((feature, index) => {
        const IconComponent = feature.icon;
        return (
          <View
            key={`feature-${index}`}
            style={[styles.featureCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.featureIcon}>
              <IconComponent width={48} height={48} fill={feature.color} />
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
        );
      })}

      <View style={styles.buttonContainer}>
        <Button
          title={t('features.startButton')}
          onPress={onStartGame}
          variant="primary"
          customColor={primaryColor}
          style={styles.startButton}
        />
      </View>
    </View>
  );
};

export default DuoFeatures;