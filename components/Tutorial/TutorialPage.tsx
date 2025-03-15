// components/Tutorial/TutorialPage.tsx
import React, { ReactNode } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { spacing, radius } from "@/utils/theme";

interface TutorialPageProps {
  title: string;
  children: ReactNode;
  onNext: () => void;
  onBack: () => void;
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
  isFirstPage = false,
  isLastPage = false,
  nextText = "Weiter",
  backText = "Zurück",
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();

  return (
    <Animated.View 
      style={[
        styles.container
      ]}
      entering={FadeIn.duration(300)}
    >
      {/* Header with safe area padding */}
      <View style={[
        styles.header, 
        { paddingTop: Math.max(insets.top, 16) }
      ]}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={onBack}
          disabled={isFirstPage}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather 
            name="chevron-left" 
            size={24} 
            color={isFirstPage ? "transparent" : colors.textPrimary} 
          />
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {title}
        </Text>
        
        <View style={styles.rightPlaceholder} />
      </View>

      {/* Scrollable content */}
      <View style={styles.content}>
        {children}
      </View>

      {/* Navigation Buttons with bottom safe area padding */}
      <View style={[
        styles.buttonsContainer,
        { paddingBottom: Math.max(insets.bottom, 16) }
      ]}>
        {!isFirstPage && (
          <TouchableOpacity 
            style={[
              styles.button, 
              styles.backBtn,
              { backgroundColor: colors.surface, borderColor: colors.border }
            ]} 
            onPress={onBack}
          >
            <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
              {backText}
            </Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.nextBtn,
            { backgroundColor: colors.primary }
          ]} 
          onPress={onNext}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            {isLastPage ? "Verstanden" : nextText}
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
  rightPlaceholder: {
    width: 40,
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