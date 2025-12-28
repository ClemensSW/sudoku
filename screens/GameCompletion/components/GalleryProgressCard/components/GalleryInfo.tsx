import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";
import { spacing } from "@/utils/theme";

interface GalleryInfoProps {
  landscape: Landscape;
}

const GalleryInfo: React.FC<GalleryInfoProps> = ({ landscape }) => {
  const { t } = useTranslation('gameCompletion');
  const theme = useTheme();
  const { colors } = theme;

  // Get motivational text based on progress
  const getProgressText = (): string => {
    if (landscape.isComplete) {
      return t('gallery.fullyUnlocked');
    }
    return t(`gallery.progress.${landscape.progress}`);
  };

  return (
    <View
      style={[
        styles.infoSection,
        {
          borderBottomColor: theme.isDark
            ? "rgba(255,255,255,0.08)"
            : "rgba(0,0,0,0.06)",
        },
      ]}
    >
      {/* Image Name */}
      <Text
        style={[styles.imageName, { color: colors.textPrimary }]}
        numberOfLines={1}
      >
        {landscape.name}
      </Text>

      {/* Motivational Progress Text */}
      <Text
        style={[styles.progressText, { color: colors.textSecondary }]}
        numberOfLines={2}
      >
        {getProgressText()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  infoSection: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xxl,      // 48px - matches gap between motivation and calendar in Serie
    paddingBottom: spacing.xxl,    // 32px
    borderBottomWidth: 1,
    alignItems: "center",
  },

  imageName: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: spacing.sm,
  },

  progressText: {
    fontSize: 13,
    fontWeight: "400",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default React.memo(GalleryInfo);
