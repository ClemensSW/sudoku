// components/Tutorial/TutorialPage.tsx
import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { spacing, radius } from "@/utils/theme";
import { useTranslation } from "react-i18next";
import { useProgressColor } from "@/hooks/useProgressColor";

interface TutorialPageProps {
  title: string;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void; // Prop for closing tutorial
  isFirstPage?: boolean;
  isLastPage?: boolean;
  nextText?: string;
  backText?: string;
}

const TutorialPage: React.FC<TutorialPageProps> = ({
  title,
  children,
  onNext,
  onBack,
  onClose,
  isFirstPage = false,
  isLastPage = false,
  nextText,
  backText,
}) => {
  const { t } = useTranslation('tutorial');
  const theme = useTheme();
  const { colors, typography } = theme;
  const insets = useSafeAreaInsets();
  const progressColor = useProgressColor();

  const defaultNextText = nextText || t('navigation.next');
  const defaultBackText = backText || t('navigation.back');

  return (
    <Animated.View style={[styles.container]} entering={FadeIn.duration(300)}>
      {/* Header with safe area padding */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Left side - empty view for spacing */}
        <View style={styles.backButton}>
          <View style={{ width: 24 }} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.size.xl }]}>
          {title}
        </Text>

        {/* Right side - close button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Scrollable content */}
      <View style={styles.content}>{children}</View>

      {/* Navigation Buttons with bottom safe area padding */}
      <View
        style={[
          styles.buttonsContainer,
          { paddingBottom: Math.max(insets.bottom, 16) },
        ]}
      >
        {!isFirstPage && (
          <TouchableOpacity
            style={[
              styles.button,
              styles.backBtn,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
            onPress={onBack}
          >
            <Text style={[styles.buttonText, { color: colors.textPrimary, fontSize: typography.size.md }]}>
              {defaultBackText}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.nextBtn,
            { backgroundColor: progressColor },
          ]}
          onPress={onNext}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText, fontSize: typography.size.md }]}>
            {isLastPage ? t('navigation.understood') : defaultNextText}
          </Text>
          {!isLastPage && (
            <Feather name="chevron-right" size={20} color={colors.buttonText} />
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
  },
  closeButton: {
    width: 40,
    alignItems: "flex-end",
  },
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    textAlign: "center",
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    justifyContent: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    marginTop: spacing.md,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.lg,
    minWidth: 110,
    minHeight: 52,
  },
  backBtn: {
    marginRight: spacing.sm,
  },
  nextBtn: {
    flex: 1,
    gap: 6,
  },
  buttonText: {
    // fontSize set dynamically via theme.typography
    fontWeight: "600",
  },
});

export default TutorialPage;