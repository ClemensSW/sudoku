// components/Tutorial/components/TutorialProgress.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { spacing } from "@/utils/theme";
import { useProgressColor } from "@/hooks/useProgressColor";

interface TutorialProgressProps {
  currentStep: number;
  totalSteps: number;
}

const TutorialProgress: React.FC<TutorialProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  const theme = useTheme();
  const progressColor = useProgressColor();

  // Generate indicators
  const renderIndicators = () => {
    return Array.from({ length: totalSteps }).map((_, index) => {
      const isActive = index < currentStep;
      const isCurrent = index === currentStep - 1;

      return (
        <View
          key={`indicator-${index}`}
          style={[
            styles.indicator,
            {
              backgroundColor: isActive
                ? progressColor
                : theme.isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.1)",
              transform: [{ scale: isCurrent ? 1.2 : 1 }],
            },
          ]}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.indicatorsContainer}>{renderIndicators()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  indicatorsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
    gap: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});

export default TutorialProgress;
