// components/Tutorial/TutorialPage.tsx
import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { spacing, radius } from "@/utils/theme";
import { useTranslation } from "react-i18next";

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
  const { colors } = theme;
  const insets = useSafeAreaInsets();

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

        <Text style={[styles.title, { color: colors.textPrimary }]}>
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
            <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
              {defaultBackText}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            styles.nextBtn,
            { backgroundColor: colors.primary },
          ]}
          onPress={onNext}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
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
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    minWidth: 120,
  },
  backBtn: {
    marginRight: spacing.sm,
    borderWidth: 1,
  },
  nextBtn: {
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: spacing.xs,
  },
});

export default TutorialPage;