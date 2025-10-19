import React from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Button from "@/components/Button/Button";
import { spacing } from "@/utils/theme";

interface GalleryActionProps {
  progressColor: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
}

const GalleryAction: React.FC<GalleryActionProps> = ({
  progressColor,
  onPress,
  variant = 'primary',
}) => {
  const { t } = useTranslation('gameCompletion');

  return (
    <View style={styles.actionSection}>
      <Button
        title={t('buttons.viewGallery')}
        onPress={onPress}
        variant={variant}
        customColor={progressColor}
        iconLeft={<Feather name="image" size={18} />}
        iconRight={<Feather name="arrow-right" size={18} />}
        style={styles.galleryButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  actionSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  galleryButton: {
    width: "100%",
  },
});

export default React.memo(GalleryAction);
