import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import styles from "./SupporterBadge.styles";

interface SupporterBadgeProps {
  remainingUnlocks?: number;
  compact?: boolean;
}

const SupporterBadge: React.FC<SupporterBadgeProps> = ({
  remainingUnlocks,
  compact = false,
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const { t } = useTranslation('gallery');

  if (compact) {
    // Compact version for list items
    return (
      <View
        style={[
          styles.compactBadge,
          {
            backgroundColor: theme.isDark
              ? "rgba(147, 51, 234, 0.2)"
              : "rgba(147, 51, 234, 0.1)",
          },
        ]}
      >
        <Feather name="star" size={12} color="#9333EA" />
        <Text style={[styles.compactText, { color: "#9333EA" }]}>
          {t('supporterBadge.premium')}
        </Text>
      </View>
    );
  }

  // Full version with unlock count
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.isDark
            ? "rgba(147, 51, 234, 0.15)"
            : "rgba(147, 51, 234, 0.1)",
          borderColor: theme.isDark
            ? "rgba(147, 51, 234, 0.3)"
            : "rgba(147, 51, 234, 0.2)",
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <Feather name="star" size={16} color="#9333EA" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: "#9333EA" }]}>
          {t('supporterBadge.supporter')}
        </Text>
        {remainingUnlocks !== undefined && (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {t('supporterBadge.remaining', { count: remainingUnlocks })}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SupporterBadge;
