import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { darkenColor } from "../utils/colorHelpers";
import { spacing } from "@/utils/theme";

interface GalleryActionProps {
  progressColor: string;
  onPress: () => void;
}

const GalleryAction: React.FC<GalleryActionProps> = ({
  progressColor,
  onPress,
}) => {
  const { t } = useTranslation('gameCompletion');

  return (
    <View style={styles.actionSection}>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.galleryButton,
          {
            backgroundColor: pressed
              ? darkenColor(progressColor, 20)
              : progressColor,
            shadowColor: progressColor,
          },
        ]}
      >
        <Feather name="image" size={18} color="#FFFFFF" />
        <Text style={styles.buttonText}>{t('buttons.viewGallery')}</Text>
        <Feather name="arrow-right" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  actionSection: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
  },

  galleryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});

export default React.memo(GalleryAction);
