import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import styles from "./SupporterBadge.styles";
import GiftIcon from "@/assets/svg/gift.svg";

interface SupporterBadgeProps {
  remainingUnlocks?: number;
  compact?: boolean;
}

const SupporterBadge: React.FC<SupporterBadgeProps> = ({
  remainingUnlocks,
  compact = false,
}) => {
  const { colors, typography, isDark } = useTheme();
  const { t } = useTranslation('gallery');

  // Premium gold color
  const premiumColor = '#D4AF37';

  if (compact) {
    // Compact version for list items
    return (
      <View
        style={[
          styles.compactBadge,
          {
            backgroundColor: isDark
              ? "rgba(212, 175, 55, 0.15)"
              : "rgba(212, 175, 55, 0.1)",
          },
        ]}
      >
        <Feather name="award" size={12} color={premiumColor} />
        <Text style={[styles.compactText, { color: premiumColor, fontSize: typography.size.xs }]}>
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
          backgroundColor: isDark
            ? "rgba(212, 175, 55, 0.12)"
            : "rgba(212, 175, 55, 0.08)",
          borderColor: isDark
            ? "rgba(212, 175, 55, 0.3)"
            : "rgba(212, 175, 55, 0.25)",
        },
      ]}
    >
      <View style={styles.iconContainer}>
        <GiftIcon width={20} height={20} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: premiumColor, fontSize: typography.size.xs }]}>
          {t('supporterBadge.supporter')}
        </Text>
        {remainingUnlocks !== undefined && (
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
            {t('supporterBadge.remaining', { count: remainingUnlocks })}
          </Text>
        )}
      </View>
    </View>
  );
};

export default SupporterBadge;
