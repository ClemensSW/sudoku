// app/_layout.tsx
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { ThemeProvider, useTheme } from "@/utils/theme/ThemeProvider";
import { AlertProvider } from "@/components/CustomAlert/AlertProvider";
import { NavigationProvider, useNavigation } from "@/contexts/navigation";
import { I18nProvider } from "@/utils/i18n/I18nProvider";
import { ColorProvider } from "@/contexts/color/ColorContext";
import { BackgroundMusicProvider } from "@/contexts/BackgroundMusicProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Platform, View, StyleSheet, Text, TextInput } from "react-native";

// Disable system font scaling - App controls its own font sizes
// @ts-ignore - defaultProps exists at runtime
Text.defaultProps = Text.defaultProps || {};
// @ts-ignore
Text.defaultProps.allowFontScaling = false;
// @ts-ignore - defaultProps exists at runtime
TextInput.defaultProps = TextInput.defaultProps || {};
// @ts-ignore
TextInput.defaultProps.allowFontScaling = false;

// Also disable font scaling for Animated.Text (react-native-reanimated)
import Animated from "react-native-reanimated";
// @ts-ignore
if (Animated.Text) {
  // @ts-ignore
  Animated.Text.defaultProps = Animated.Text.defaultProps || {};
  // @ts-ignore
  Animated.Text.defaultProps.allowFontScaling = false;
}

import * as NavigationBar from "expo-navigation-bar";
import BottomNavigation from "@/components/BottomNavigation/BottomNavigation";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { initializeFirebase } from "@/utils/cloudSync/firebaseConfig";
import { AuthProvider } from "@/contexts/AuthProvider";
import { DevLeagueProvider } from "@/contexts/DevLeagueContext";
import { configureGoogleSignIn } from "@/utils/auth/googleAuth";
import BillingManager from "@/screens/SupportShop/utils/billing/BillingManager";
import { processOfflineQueue } from "@/utils/cloudSync/feedbackService";
import { useDeepLink } from "@/hooks/online/useDeepLink";

/**
 * App Container - Main Layout Component
 * Handles theme-dependent styling and navigation rendering
 */
function AppContainer() {
  const theme = useTheme();
  const { isBottomNavVisible, currentRoute } = useNavigation();

  // Handle deep links for private match invites
  useDeepLink();

  // DEBUG LOG
  console.log('[AppContainer] Rendering with:', {
    currentRoute,
    isBottomNavVisible,
  });

  // Configure Android Navigation Bar
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBackgroundColorAsync("transparent");
    }
  }, []);

  // Theme-based background color
  const containerStyle = {
    backgroundColor: theme.isDark ? "#202124" : "#F8F9FA",
    flex: 1,
  };

  return (
    <View style={containerStyle}>
      <StatusBar hidden={true} />

      {/* Stack Navigator */}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "none",
          contentStyle: containerStyle,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="game"
          options={{
            gestureEnabled: false, // Disable swipe gestures to prevent navigation when settings overlay is open
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            gestureEnabled: false, // Disable swipe gestures for settings
            animation: "slide_from_bottom",
          }}
        />
        <Stack.Screen name="(game)" />
        <Stack.Screen name="duo" />
        <Stack.Screen name="leistung" />
        <Stack.Screen name="gallery" />
        <Stack.Screen name="duo-game" />
      </Stack>

      {/* Bottom Navigation - Conditionally Rendered */}
      {isBottomNavVisible && <BottomNavigation />}
    </View>
  );
}

/**
 * App Layout - Root Component
 * Sets up all providers in the correct order
 */
export default function AppLayout() {
  // Initialize Firebase & Google Sign-In on app startup
  useEffect(() => {
    const initializeApp = async () => {
      // Initialize Firebase
      await initializeFirebase();

      // Process offline feedback queue after Firebase is ready
      try {
        const uploadedCount = await processOfflineQueue();
        if (uploadedCount > 0) {
          console.log(`[App] ✅ Processed ${uploadedCount} pending feedback items from offline queue`);
        }
      } catch (error) {
        console.warn('[App] Failed to process offline feedback queue:', error);
      }
    };

    initializeApp();

    // Configure Google Sign-In (only in Development Build)
    try {
      configureGoogleSignIn();
    } catch (error) {
      console.warn('[App] Google Sign-In not available (Expo Go detected)');
    }

    // Initialize BillingManager (RevenueCat)
    const initBilling = async () => {
      try {
        const billingManager = BillingManager.getInstance();
        await billingManager.initialize();
        console.log('[App] BillingManager initialized successfully');
      } catch (error) {
        console.warn('[App] BillingManager initialization failed (mock mode or config missing):', error);
      }
    };
    initBilling();
  }, []);

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <I18nProvider>
          <ThemeProvider>
            <ColorProvider>
              <BackgroundMusicProvider>
                <NavigationProvider>
                  <AuthProvider>
                    <BottomSheetModalProvider>
                      <DevLeagueProvider>
                        <AlertProvider>
                          <AppContainer />
                        </AlertProvider>
                      </DevLeagueProvider>
                    </BottomSheetModalProvider>
                  </AuthProvider>
                </NavigationProvider>
              </BackgroundMusicProvider>
            </ColorProvider>
          </ThemeProvider>
        </I18nProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
});