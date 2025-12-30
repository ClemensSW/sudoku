// screens/GalleryScreen/components/FilterModal/components/InfoSection.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { spacing, radius } from "@/utils/theme";
import { useTranslation } from "react-i18next";
import { useProgressColor } from "@/hooks/useProgressColor";

interface InfoItemProps {
  icon: string;
  title: string;
  description: string;
  iconColor: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, title, description, iconColor }) => {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.infoItem}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: `${iconColor}15` },
        ]}
      >
        <Feather
          name={icon as any}
          size={16}
          color={iconColor}
        />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.infoTitle,
            {
              color: colors.textPrimary,
              fontSize: typography.size.sm,
            },
          ]}
        >
          {title}
        </Text>
        <Text
          style={[
            styles.infoDescription,
            {
              color: colors.textSecondary,
              fontSize: typography.size.xs,
            },
          ]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

const InfoSection: React.FC = () => {
  const { t } = useTranslation('gallery');
  const { colors, typography, isDark } = useTheme();
  const progressColor = useProgressColor();

  return (
    <View>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.textSecondary,
            fontSize: typography.size.sm,
          },
        ]}
      >
        {t('filterModal.infoSection.title')}
      </Text>

      <View
        style={[
          styles.infoCard,
          {
            backgroundColor: isDark
              ? 'rgba(255, 255, 255, 0.04)'
              : 'rgba(0, 0, 0, 0.02)',
            borderColor: isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : 'rgba(0, 0, 0, 0.06)',
          },
        ]}
      >
        <InfoItem
          icon="grid"
          iconColor={progressColor}
          title={t('filterModal.infoSection.collect.title')}
          description={t('filterModal.infoSection.collect.description')}
        />

        <InfoItem
          icon="target"
          iconColor={colors.info}
          title={t('filterModal.infoSection.selectGoal.title')}
          description={t('filterModal.infoSection.selectGoal.description')}
        />

        <InfoItem
          icon="heart"
          iconColor={colors.error}
          title={t('filterModal.infoSection.favorites.title')}
          description={t('filterModal.infoSection.favorites.description')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontWeight: "600",
    marginBottom: spacing.sm,
    opacity: 0.8,
  },

  infoCard: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.md,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    minHeight: 48,
  },

  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  textContainer: {
    flex: 1,
  },

  infoTitle: {
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },

  infoDescription: {
    lineHeight: 16,
  },
});

export default InfoSection;
