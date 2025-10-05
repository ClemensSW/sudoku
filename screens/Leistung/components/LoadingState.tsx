// screens/LeistungScreen/components/LoadingState.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTranslation } from "react-i18next";

const LoadingState: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const { t } = useTranslation('leistung');

  return (
    <Animated.View 
      style={styles.loadingContainer}
      entering={FadeIn.duration(400)}
    >
      <Feather name="loader" size={32} color={colors.primary} />
      <Text
        style={[styles.loadingText, { color: colors.textSecondary }]}
      >
        {t('loading')}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default LoadingState;