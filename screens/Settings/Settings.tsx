// screens/SettingsScreen/SettingsScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text as RNText,
  ScrollView,
  StyleSheet,
  BackHandler,
  Share,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Feather } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { useTheme } from "@/utils/theme/ThemeProvider";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { quitGameAlert } from "@/components/CustomAlert/AlertHelpers";
import { useBackgroundMusic } from "@/contexts/BackgroundMusicProvider";
import { useNavigation } from "@/contexts/navigation";
import { useAuth } from "@/hooks/useAuth";
import { signInWithGoogle } from "@/utils/auth/googleAuth";
import { manualSync } from "@/utils/cloudSync/syncService";
import { deleteUserAccount } from "@/utils/auth/deleteAccount";
import Header from "@/components/Header/Header";
import TutorialContainer from "@/screens/Tutorial/TutorialContainer";
import SupportShopScreen from "@/screens/SupportShop";
import { loadSettings, saveSettings, DEFAULT_SETTINGS } from "@/utils/storage";
import { GameSettings as GameSettingsType } from "@/utils/storage";
import { triggerHaptic, setVibrationEnabledCache } from "@/utils/haptics";
import AboutModal from "./components/AboutModal";
import DevTestingMenu from "./DevTestingMenu";
import LegalScreen from "./LegalScreen";
import Constants from 'expo-constants';

// Import components
import SettingsCategoryList from "./components/SettingsCategoryList";
import HelpSection from "./components/HelpSection/HelpSection";
import ActionsSection from "./components/ActionsSection/ActionsSection";
import ProfileGroup from "./components/ProfileGroup";
import AuthSection from "./components/AuthSection/AuthSection";
import AccountInfoCard from "./components/AuthSection/AccountInfoCard";

// Import modals
import AppearanceSettingsModal from "./components/AppearanceSettingsModal";
import GameSettingsModal from "./components/GameSettingsModal";
import HelpSettingsModal from "./components/HelpSettingsModal";
import CommunitySettingsModal from "./components/CommunitySettingsModal";
import AccountDataModal from "./components/AccountDataModal";
import LocalDataModal from "./components/LocalDataModal";
import InfoSettingsModal from "./components/InfoSettingsModal";

import styles from "./Settings.styles";

interface SettingsScreenProps {
  onBackToGame?: () => void;
  onQuitGame?: () => void;
  onPauseGame?: () => void;
  onAutoNotes?: () => void;
  onSettingsChanged?: (
    key: keyof GameSettingsType,
    value: boolean | string
  ) => void;
  fromGame?: boolean;
  isDuoMode?: boolean; // New prop to indicate Duo mode
}

const Settings: React.FC<SettingsScreenProps> = ({
  onBackToGame,
  onQuitGame,
  onPauseGame,
  onAutoNotes,
  onSettingsChanged,
  fromGame = false,
  isDuoMode = false, // Default to false
}) => {
  const { t, i18n } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { showAlert } = useAlert();
  const { toggleMusic } = useBackgroundMusic();
  const { hideBottomNav, resetBottomNav } = useNavigation();
  const { updateTheme } = theme;
  const { user, isLoggedIn, loading: authLoading, signOut } = useAuth();

  const [settings, setSettings] = useState<GameSettingsType | null>(null);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSupportShop, setShowSupportShop] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showLegalScreen, setShowLegalScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Modal states for Level-2 navigation
  const [showDesignModal, setShowDesignModal] = useState(false);
  const [showGameModal, setShowGameModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showCommunityModal, setShowCommunityModal] = useState(false);
  const [showAccountDataModal, setShowAccountDataModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isChangingTheme, setIsChangingTheme] = useState(false);

  // Determine if we should show game-specific features
  const showGameFeatures = fromGame && !!onQuitGame;

  useEffect(() => {
    const loadData = async () => {
      const loadedSettings = await loadSettings();
      setSettings(loadedSettings ?? DEFAULT_SETTINGS);
      setIsLoading(false);
    };

    loadData();
  }, []);

  // Hide bottom navigation when Settings is opened
  useEffect(() => {
    hideBottomNav();

    // Cleanup: reset bottom nav when leaving settings (except when from game)
    return () => {
      if (!fromGame) {
        resetBottomNav();
      }
    };
  }, [hideBottomNav, resetBottomNav, fromGame]);

  // Add the BackHandler to capture the Android back button
  useEffect(() => {
    // Only for Android and when we come from the game
    if (fromGame && onBackToGame) {
      // Add BackHandler listener
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          // Back to the game, instead of following the standard navigation
          onBackToGame();
          // Return true to indicate that we have handled the back button
          return true;
        }
      );

      // Remove listener during cleanup
      return () => backHandler.remove();
    }
  }, [fromGame, onBackToGame]);

  const handleSettingChange = async (
    key: keyof GameSettingsType,
    value: boolean | string
  ) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);
    await saveSettings(updatedSettings);

    // Haptic feedback with new utility - but only if vibration is not being deactivated
    if (!(key === "vibration" && value === false)) {
      triggerHaptic("light");
    }

    // If the vibration setting is changed, also update the cache
    if (key === "vibration") {
      setVibrationEnabledCache(value as boolean);
    }

    // If the background music setting is changed, toggle the music
    if (key === "backgroundMusic") {
      await toggleMusic(value as boolean);
    }

    // Notify GameScreen about the change
    if (onSettingsChanged) {
      onSettingsChanged(key, value);
    }
  };

  const handleAutoNotes = () => {
    if (onAutoNotes) {
      onAutoNotes();
      handleBack();
    }
  };

  const handleBack = () => {
    if (fromGame && onBackToGame) {
      // When opened from game, ALWAYS use the callback
      onBackToGame();
    } else if (!fromGame) {
      // Only use router.back() when NOT from game
      router.back();
    }
    // If fromGame but no callback: do nothing (shouldn't happen)
  };

  const handleQuitGame = () => {
    showAlert(
      quitGameAlert(() => {
        if (onQuitGame) {
          onQuitGame();
        } else {
          router.replace("/");
        }
      })
    );
  };

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

  const handleAboutPress = () => {
    triggerHaptic("light");
    setShowAboutModal(true);
  };

  const handleLegalPress = () => {
    triggerHaptic("light");
    setShowLegalScreen(true);
  };

  // Modal handlers
  const handleThemeChange = async (value: "light" | "dark") => {
    setIsChangingTheme(true);
    await updateTheme(value);
    // Also update local settings state
    if (settings) {
      setSettings({ ...settings, darkMode: value });
    }
    setTimeout(() => setIsChangingTheme(false), 300);
  };

  const handleLanguageChange = async (language: "de" | "en" | "hi") => {
    await i18n.changeLanguage(language);
    triggerHaptic("success");
  };

  const handleGoogleSignIn = async () => {
    try {
      triggerHaptic("light");
      console.log('[Settings] Starting Google Sign-In...');

      // Zeige Loading-State (via authLoading wird automatisch getrackt)
      const user = await signInWithGoogle();

      if (user) {
        // Success!
        console.log('[Settings] ✅ Google Sign-In successful:', user.email);
        triggerHaptic("success");

        showAlert({
          title: t("authSection.signInSuccess") || "Erfolgreich angemeldet!",
          message: `Willkommen ${user.displayName || user.email}!`,
          type: "success",
          buttons: [
            {
              text: "OK",
              style: "primary",
              onPress: () => {},
            },
          ],
        });

        // Immediate sync after login (non-blocking)
        console.log('[Settings] Triggering immediate sync after login...');
        manualSync().then(result => {
          if (result.success) {
            console.log('[Settings] ✅ Immediate sync after login successful');
          } else {
            console.log('[Settings] ⚠️ Immediate sync after login skipped/failed:', result.errors);
          }
        }).catch(error => {
          console.error('[Settings] ❌ Immediate sync after login error:', error);
        });
      } else {
        // User cancelled
        console.log('[Settings] User cancelled Google Sign-In');
      }
    } catch (error: any) {
      console.error('[Settings] ❌ Google Sign-In error:', error);
      triggerHaptic("error");

      // Show error message
      showAlert({
        title: t("authSection.signInError") || "Anmeldung fehlgeschlagen",
        message: error.message || "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
        type: "error",
        buttons: [
          {
            text: "OK",
            style: "primary",
            onPress: () => {},
          },
        ],
      });
    }
  };

  const handleAppleSignIn = () => {
    triggerHaptic("light");
    // TODO: Implement Apple Sign-In
    showAlert({
      title: t("authSection.appleSignIn"),
      message: t("authSection.inDevelopment"),
      type: "info",
      buttons: [
        {
          text: "OK",
          style: "primary",
          onPress: () => {},
        },
      ],
    });
  };

  const handleSignOut = async () => {
    try {
      triggerHaptic("light");
      showAlert({
        title: t('authSection.signOutConfirmTitle'),
        message: t('authSection.signOutConfirmMessage'),
        type: 'warning',
        buttons: [
          {
            text: t('authSection.cancel'),
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: t('authSection.signOut'),
            style: 'destructive',
            onPress: async () => {
              try {
                await signOut();
                triggerHaptic("success");
                setShowAccountDataModal(false);
                showAlert({
                  title: t('authSection.signOutSuccess'),
                  message: t('authSection.signOutSuccessMessage'),
                  type: 'success',
                  buttons: [
                    {
                      text: 'OK',
                      style: 'primary',
                      onPress: () => {},
                    },
                  ],
                });
              } catch (error: any) {
                console.error('[Settings] Sign out error:', error);
                triggerHaptic("error");
                showAlert({
                  title: t('authSection.signOutError'),
                  message: error.message || t('authSection.signOutErrorMessage'),
                  type: 'error',
                  buttons: [
                    {
                      text: 'OK',
                      style: 'primary',
                      onPress: () => {},
                    },
                  ],
                });
              }
            },
          },
        ],
      });
    } catch (error) {
      console.error('[Settings] Sign out alert error:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      triggerHaptic("warning");
      showAlert({
        title: t('accountData.deleteAccountConfirmTitle'),
        message: t('accountData.deleteAccountConfirmMessage'),
        type: 'warning',
        buttons: [
          {
            text: t('accountData.cancel'),
            style: 'cancel',
            onPress: () => {},
          },
          {
            text: t('accountData.deleteAccount'),
            style: 'destructive',
            onPress: async () => {
              try {
                console.log('[Settings] Deleting account...');
                await deleteUserAccount();
                setShowAccountDataModal(false);
                triggerHaptic("success");

                // Navigate to home screen
                router.replace('/');

                showAlert({
                  title: t('accountData.deleteAccountSuccess'),
                  message: t('accountData.deleteAccountSuccessMessage'),
                  type: 'success',
                  buttons: [
                    {
                      text: 'OK',
                      style: 'primary',
                      onPress: () => {},
                    },
                  ],
                });
              } catch (error: any) {
                console.error('[Settings] ❌ Delete account error:', error);
                triggerHaptic("error");
                showAlert({
                  title: t('accountData.deleteAccountError'),
                  message: error.message || t('accountData.deleteAccountErrorMessage'),
                  type: 'error',
                  buttons: [
                    {
                      text: 'OK',
                      style: 'primary',
                      onPress: () => {},
                    },
                  ],
                });
              }
            },
          },
        ],
      });
    } catch (error) {
      console.error('[Settings] Delete account alert error:', error);
    }
  };

  if (isLoading) {
    return (
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          styles.container,
          { backgroundColor: colors.background },
        ]}
        entering={SlideInUp.duration(300)}
      >
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Header title={t("title")} onBackPress={handleBack} />
        <View style={styles.loadingContainer}>
          <Feather name="loader" size={24} color={colors.primary} />
        </View>
      </Animated.View>
    );
  }

  return (
    <Animated.View
      style={[
        StyleSheet.absoluteFill,
        styles.container,
        { backgroundColor: colors.background },
      ]}
      entering={SlideInUp.duration(300)}
    >
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <Header title={t("title")} onBackPress={handleBack} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
      >
        {/* Profil Section - Inline in Normal mode only */}
        {!showGameFeatures && (
          <Animated.View
            style={styles.section}
            entering={FadeInDown.delay(50).duration(500)}
          >
            <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t("categories.profile")}
            </RNText>
            <ProfileGroup />
          </Animated.View>
        )}

        {/* Account Info Card - Show if logged in */}
        {!showGameFeatures && isLoggedIn && (
          <AccountInfoCard />
        )}

        {/* Auth Section - Only show if not logged in */}
        {!showGameFeatures && !isLoggedIn && (
          <AuthSection
            onGooglePress={handleGoogleSignIn}
            onApplePress={handleAppleSignIn}
          />
        )}

        {/* Hilfe Section - Inline in game mode only */}
        {showGameFeatures && (
          <Animated.View
            style={styles.section}
            entering={FadeInDown.delay(50).duration(500)}
          >
            <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {t("categories.help")}
            </RNText>
            <HelpSection
              showGameFeatures={showGameFeatures && !isDuoMode}
              onAutoNotes={showGameFeatures && !isDuoMode ? handleAutoNotes : undefined}
              onHowToPlay={() => setShowHowToPlay(true)}
            />
          </Animated.View>
        )}

        {/* Actions Section - Inline when in game */}
        {showGameFeatures && (
          <Animated.View
            style={styles.section}
            entering={FadeInDown.delay(100).duration(500)}
          >
            <RNText style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {isDuoMode || !onPauseGame ? t("sections.action") : t("categories.actions")}
            </RNText>
            <ActionsSection
              showGameFeatures={showGameFeatures}
              onQuitGame={onQuitGame}
              onPauseGame={onPauseGame}
              isDuoMode={isDuoMode}
            />
          </Animated.View>
        )}

        {/* Settings Category List - Navigierbare Kategorien */}
        <Animated.View
          entering={FadeIn.duration(500)}
        >
          <SettingsCategoryList
            showGameFeatures={showGameFeatures}
            isLoggedIn={isLoggedIn}
            onDesignPress={() => setShowDesignModal(true)}
            onGamePress={() => setShowGameModal(true)}
            onHelpPress={() => setShowHelpModal(true)}
            onCommunityPress={() => setShowCommunityModal(true)}
            onAccountDataPress={() => setShowAccountDataModal(true)}
            onInfoPress={() => setShowInfoModal(true)}
          />
        </Animated.View>

        {/* Dev Testing Menu - Only in Expo Go */}
        {__DEV__ && Constants.appOwnership === 'expo' && (
          <Animated.View
            style={styles.section}
            entering={FadeInDown.delay(600).duration(500)}
          >
            <DevTestingMenu />
          </Animated.View>
        )}
      </ScrollView>

      {/* How to Play Tutorial - Fullscreen Overlay */}
      {showHowToPlay && (
        <TutorialContainer
          onComplete={() => setShowHowToPlay(false)}
          onBack={() => setShowHowToPlay(false)}
        />
      )}

      {/* Level-2 Navigation Modals */}
      {showDesignModal && (
        <AppearanceSettingsModal
          visible={showDesignModal}
          onClose={() => setShowDesignModal(false)}
          themeValue={settings?.darkMode || "light"}
          onThemeChange={handleThemeChange}
          onLanguageChange={handleLanguageChange}
          isChangingTheme={isChangingTheme}
        />
      )}

      {showGameModal && (
        <GameSettingsModal
          visible={showGameModal}
          onClose={() => setShowGameModal(false)}
          settings={settings}
          onSettingChange={handleSettingChange}
          isDuoMode={isDuoMode}
        />
      )}

      {showHelpModal && (
        <HelpSettingsModal
          visible={showHelpModal}
          onClose={() => setShowHelpModal(false)}
          onHowToPlay={() => {
            setShowHelpModal(false);
            setShowHowToPlay(true);
          }}
        />
      )}

      {showCommunityModal && (
        <CommunitySettingsModal
          visible={showCommunityModal}
          onClose={() => setShowCommunityModal(false)}
          onShareApp={handleShareApp}
          onSupportPress={() => {
            setShowCommunityModal(false);
            setShowSupportShop(true);
          }}
          showAlert={showAlert}
        />
      )}

      {showAccountDataModal && isLoggedIn && (
        <AccountDataModal
          visible={showAccountDataModal}
          onClose={() => setShowAccountDataModal(false)}
          onSignOut={handleSignOut}
          onDeleteAccount={handleDeleteAccount}
          showAlert={showAlert}
        />
      )}

      {showAccountDataModal && !isLoggedIn && (
        <LocalDataModal
          visible={showAccountDataModal}
          onClose={() => setShowAccountDataModal(false)}
          showAlert={showAlert}
        />
      )}

      {showInfoModal && (
        <InfoSettingsModal
          visible={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          onAboutPress={() => {
            setShowInfoModal(false);
            handleAboutPress();
          }}
          onLegalPress={() => {
            setShowInfoModal(false);
            handleLegalPress();
          }}
        />
      )}

      {/* Support Shop Modal */}
      {showSupportShop && <SupportShopScreen onClose={() => setShowSupportShop(false)} />}

      {/* About Modal */}
      {showAboutModal && (
        <AboutModal visible={showAboutModal} onClose={() => setShowAboutModal(false)} />
      )}

      {/* Legal Screen Modal */}
      {showLegalScreen && (
        <LegalScreen visible={showLegalScreen} onClose={() => setShowLegalScreen(false)} />
      )}
    </Animated.View>
  );
};

export default Settings;
