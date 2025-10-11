// screens/Settings/screens/InfoSettingsScreen.tsx
import React, { useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Header from "@/components/Header/Header";
import InfoSection from "../components/InfoSection/InfoSection";
import AboutModal from "../components/AboutModal";
import LegalScreen from "../LegalScreen";
import { triggerHaptic } from "@/utils/haptics";

const InfoSettingsScreen: React.FC = () => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLegalScreen, setShowLegalScreen] = useState(false);

  const handleAboutPress = () => {
    triggerHaptic("light");
    setShowAboutModal(true);
  };

  const handleLegalPress = () => {
    triggerHaptic("light");
    setShowLegalScreen(true);
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
          title={t("categories.info")}
          onBackPress={() => router.back()}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <InfoSection
            onAboutPress={handleAboutPress}
            onLegalPress={handleLegalPress}
          />
        </ScrollView>
      </Animated.View>

      {/* About Modal */}
      <AboutModal
        visible={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />

      {/* Legal Screen */}
      <LegalScreen
        visible={showLegalScreen}
        onClose={() => setShowLegalScreen(false)}
      />
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

export default InfoSettingsScreen;
