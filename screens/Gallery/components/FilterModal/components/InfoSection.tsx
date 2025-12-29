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
  iconColor?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, title, description, iconColor }) => {
  const theme = useTheme();
  const { colors, typography } = theme;

  return (
    <View style={styles.infoItem}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: iconColor ? `${iconColor}20` : `${colors.primary}20` }
      ]}>
        <Feather
          name={icon as any}
          size={20}
          color={iconColor || colors.primary}
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.infoTitle, { color: colors.textPrimary, fontSize: typography.size.sm }]}>
          {title}
        </Text>
        <Text style={[styles.infoDescription, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const InfoSection: React.FC = () => {
  const { t } = useTranslation('gallery');
  const theme = useTheme();
  const { colors, typography } = theme;
  const progressColor = useProgressColor();

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontSize: typography.size.md }]}>
        {t('filterModal.infoSection.title')}
      </Text>

      <View style={styles.infoContainer}>
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
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    marginBottom: spacing.md,
  },
  
  infoContainer: {
    gap: spacing.md,
  },
  
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  
  textContainer: {
    flex: 1,
  },
  
  infoTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
    marginBottom: spacing.xxs,
  },

  infoDescription: {
    // fontSize set dynamically via theme.typography
    lineHeight: 18,
  },
});

export default InfoSection;