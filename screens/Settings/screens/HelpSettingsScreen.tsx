// screens/Settings/screens/HelpSettingsScreen.tsx
import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Header from "@/components/Header/Header";
import HelpSection from "../components/HelpSection/HelpSection";
import TutorialContainer from "@/screens/Tutorial/TutorialContainer";

interface HelpSettingsScreenProps {
  onAutoNotes?: () => void;
  showGameFeatures?: boolean;
}

const HelpSettingsScreen: React.FC<HelpSettingsScreenProps> = ({
  onAutoNotes,
  showGameFeatures = false,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const handleAutoNotes = () => {
    if (onAutoNotes) {
      onAutoNotes();
      router.back();
    }
  };

  return (
    <>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.container,
          { backgroundColor: colors.background },
        ]}
        entering={FadeIn.duration(300)}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} />

        <Header
          title={t("categories.help")}
          onBackPress={() => router.back()}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <HelpSection
            showGameFeatures={showGameFeatures}
            onAutoNotes={showGameFeatures ? handleAutoNotes : undefined}
            onHowToPlay={() => setShowHowToPlay(true)}
          />
        </ScrollView>
      </Animated.View>

      {/* How to Play Modal */}
      {showHowToPlay && (
        <TutorialContainer
          onComplete={() => setShowHowToPlay(false)}
          onBack={() => setShowHowToPlay(false)}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});

export default HelpSettingsScreen;
