import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import Animated, { FadeIn, SlideInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useProgressColor } from "@/hooks/useProgressColor";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";
import SchlossOffnenIcon from "@/assets/svg/schloss-offnen.svg";
import styles from "./UnlockConfirmationDialog.styles";

interface UnlockConfirmationDialogProps {
  visible: boolean;
  imageName: string;
  remainingUnlocks: number;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

const UnlockConfirmationDialog: React.FC<UnlockConfirmationDialogProps> = ({
  visible,
  imageName,
  remainingUnlocks,
  onConfirm,
  onCancel,
  loading = false,
}) => {
  const theme = useTheme();
  const { colors, typography } = theme;
  const progressColor = useProgressColor();
  const { t } = useTranslation('gallery');

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        {/* Blur backdrop */}
        <BlurView
          intensity={20}
          tint={theme.isDark ? "dark" : "light"}
          style={styles.blurView}
        />

        {/* Dialog */}
        <Animated.View
          entering={SlideInDown.duration(300)}
          style={[
            styles.dialogContainer,
            {
              backgroundColor: theme.isDark ? colors.card : "#FFFFFF",
            },
          ]}
        >
          {/* Icon */}
          <View style={styles.iconContainer}>
            <SchlossOffnenIcon width={64} height={64} fill={progressColor} />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.size.lg }]}>
            {t('unlockDialog.title', { name: imageName })}
          </Text>

          {/* Message */}
          <Text style={[styles.message, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
            {t('unlockDialog.message', { count: remainingUnlocks })}
          </Text>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              ]}
              onPress={onCancel}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Text style={[styles.cancelButtonText, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
                {t('unlockDialog.cancel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.confirmButton]}
              onPress={onConfirm}
              disabled={loading}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#E5C158', '#D4AF37', '#C19A2E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <Text style={[styles.confirmButtonText, { fontSize: typography.size.sm }]}>
                    {t('unlockDialog.unlocking')}
                  </Text>
                ) : (
                  <>
                    <Text style={[styles.confirmButtonText, { fontSize: typography.size.sm }]}>
                      {t('unlockDialog.confirm')}
                    </Text>
                    <Feather name="check" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default UnlockConfirmationDialog;
