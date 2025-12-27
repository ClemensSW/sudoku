// screens/Duo/components/DuoTutorialOverlay/DuoTutorialOverlay.tsx
import React, { useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useNavigation } from "@/contexts/navigation";
import { useProgressColor } from "@/hooks/useProgressColor";
import { getPathColor } from "@/utils/pathColors";

// SVG Icons
import UnterstutzungIcon from "@/assets/svg/unterstutzung.svg";
import HappyIcon from "@/assets/svg/happy.svg";
import ZielIcon from "@/assets/svg/ziel.svg";

import styles from "./DuoTutorialOverlay.styles";

interface Feature {
  icon: React.FC<{ width: number; height: number; fill?: string }>;
  title: string;
  description: string;
  color: string;
}

interface DuoTutorialOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const DuoTutorialOverlay: React.FC<DuoTutorialOverlayProps> = ({
  visible,
  onClose,
}) => {
  const { t } = useTranslation("duo");
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  const { hideBottomNav, resetBottomNav } = useNavigation();
  const progressColor = useProgressColor();

  // Theme-based colors from path palette
  const greenColor = getPathColor("green", theme.isDark);
  const yellowColor = getPathColor("yellow", theme.isDark);
  const redColor = getPathColor("red", theme.isDark);

  // Hide/show bottom nav when overlay opens/closes
  useEffect(() => {
    if (visible) {
      hideBottomNav();
    } else {
      resetBottomNav();
    }

    return () => {
      if (visible) {
        resetBottomNav();
      }
    };
  }, [visible, hideBottomNav, resetBottomNav]);

  // Features content (same as DuoFeatures)
  const features: Feature[] = [
    {
      icon: UnterstutzungIcon,
      title: t("features.items.playTogether.title"),
      description: t("features.items.playTogether.description"),
      color: progressColor,
    },
    {
      icon: HappyIcon,
      title: t("features.items.challengingLayout.title"),
      description: t("features.items.challengingLayout.description"),
      color: yellowColor,
    },
    {
      icon: ZielIcon,
      title: t("features.items.strategyTeamwork.title"),
      description: t("features.items.strategyTeamwork.description"),
      color: redColor,
    },
  ];

  if (!visible) return null;

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: colors.background }]}
      entering={FadeIn.duration(250)}
    >
      {/* Header */}
      <View
        style={[styles.header, { paddingTop: Math.max(insets.top + 8, 24) }]}
      >
        <View style={styles.headerSpacer} />

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {t("features.title", { defaultValue: "So funktioniert's" })}
        </Text>

        {/* Close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
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
                <Text
                  style={[styles.featureTitle, { color: colors.textPrimary }]}
                >
                  {feature.title}
                </Text>
                <Text
                  style={[
                    styles.featureDescription,
                    { color: colors.textSecondary },
                  ]}
                >
                  {feature.description}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Footer with "Verstanden" button */}
      <View
        style={[
          styles.footer,
          { paddingBottom: Math.max(insets.bottom + 8, 24) },
        ]}
      >
        <TouchableOpacity
          style={[styles.understoodButton, { backgroundColor: progressColor }]}
          onPress={onClose}
        >
          <Text
            style={[styles.understoodButtonText, { color: colors.buttonText }]}
          >
            {t("tutorial.understood", { defaultValue: "Verstanden" })}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

export default DuoTutorialOverlay;
