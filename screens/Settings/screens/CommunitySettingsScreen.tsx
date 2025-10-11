// screens/Settings/screens/CommunitySettingsScreen.tsx
import React, { useState } from "react";
import { StyleSheet, ScrollView, Share } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import Header from "@/components/Header/Header";
import CommunitySection from "../components/CommunitySection/CommunitySection";
import SupportShopScreen from "@/screens/SupportShop";
import { triggerHaptic } from "@/utils/haptics";

const CommunitySettingsScreen: React.FC = () => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showSupportShop, setShowSupportShop] = useState(false);

  const handleShareApp = async () => {
    triggerHaptic("light");
    try {
      await Share.share({
        message: t("share.message"),
      });
    } catch (error) {
      console.error("Error sharing:", error);
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
          title={t("categories.community")}
          onBackPress={() => router.back()}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
        >
          <CommunitySection
            onSupportPress={() => setShowSupportShop(true)}
            onSharePress={handleShareApp}
          />
        </ScrollView>
      </Animated.View>

      {/* Support Shop Modal */}
      {showSupportShop && (
        <SupportShopScreen
          onClose={() => setShowSupportShop(false)}
          hideNavOnClose={true}
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

export default CommunitySettingsScreen;
