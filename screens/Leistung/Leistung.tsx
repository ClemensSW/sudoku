import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loadStats, GameStats } from "@/utils/storage";
import {
  loadUserProfile,
  updateUserName,
  updateUserAvatar,
  updateUserTitle,
  UserProfile,
} from "@/utils/profileStorage";
import { getAvatarUri } from "./utils/avatarStorage";
import { getLevels } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/levelData";
import { useProgressColor } from "@/hooks/useProgressColor";
import TitlePickerModal from "@/screens/GameCompletion/components/LevelCard/components/TitlePickerModal";
import CogwheelIcon from "@/assets/svg/cogwheel.svg";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import { useLandscapes } from "@/screens/Gallery/hooks/useLandscapes";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/useAuth";

// Components
import ProfileHeader from "./components/ProfileHeader";
import TabNavigator from "./components/TabNavigator";
import type { TabItem } from "./components/TabNavigator";
import LevelTab from "./components/LevelTab";
import GalleryTab from "./components/GalleryTab";
import StreakTab from "./components/StreakTab";
import AchievementsTab from "./components/AchievementsTab";

// Support
import SupportBanner from "./components/SupportBanner/SupportBanner";
import SupportShopScreen from "@/screens/SupportShop";

type TabId = "level" | "gallery" | "streak" | "times";

const Leistung: React.FC = () => {
  const { t } = useTranslation('leistung');
  const router = useRouter();
  const { tab } = useLocalSearchParams<{ tab?: string }>();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { user } = useAuth();

  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const tabChangeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cameFromSettings = useRef(false);
  const [tabSectionY, setTabSectionY] = useState<number>(0);
  const cogwheelRotation = useSharedValue(0);

  // Animated style for cogwheel rotation
  const cogwheelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${cogwheelRotation.value}deg` }],
  }));

  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("level");
  const [visitedTabs, setVisitedTabs] = useState<Record<TabId, boolean>>({
    level: true,  // Initial-Tab ist immer besucht
    gallery: false,
    streak: false,
    times: false,
  });
  const [profile, setProfile] = useState<UserProfile>({ name: "User", title: null });
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showTitleModal, setShowTitleModal] = useState(false);

  const [showSupportShop, setShowSupportShop] = useState(false);
  const { landscapes } = useLandscapes("completed");

  // Progress color for title modal
  const progressColor = useProgressColor();

  // Calculate title options - memoized for performance
  const titleOptions = useMemo(() => {
    if (!stats) return [];

    const allLevels = getLevels();
    const currentXp = stats.totalXP;

    // Calculate current level
    let currentLevel = 0;
    for (let i = 0; i < allLevels.length; i++) {
      if (currentXp >= allLevels[i].xp) {
        currentLevel = i;
      } else {
        break;
      }
    }

    return allLevels.map((level, index) => ({
      name: level.name,
      level: index,
      isUnlocked: index <= currentLevel,
    }));
  }, [stats?.totalXP]);

  // Initial-Load and when user changes (login/logout)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const loadedStats = await loadStats();
        setStats(loadedStats);

        const userProfile = await loadUserProfile();
        setProfile(userProfile);

        const uri = await getAvatarUri();
        if (userProfile.avatarUri) {
          setAvatarUri(userProfile.avatarUri);
        } else if (uri) {
          const updated = await updateUserAvatar(uri);
          setAvatarUri(uri);
          setProfile(updated);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.uid]);

  // **NEU**: Refresh bei Fokus (Titel/Avatar/Stats nach Modal-Änderungen oder Käufen)
  useFocusEffect(
    React.useCallback(() => {
      // Reverse cogwheel animation when returning from settings
      if (cameFromSettings.current) {
        cogwheelRotation.value = withTiming(cogwheelRotation.value - 360, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        });
        cameFromSettings.current = false;
      }

      let cancelled = false;
      (async () => {
        try {
          // Reload stats (wichtig für Shield-Updates nach Käufen)
          const loadedStats = await loadStats();
          if (!cancelled) setStats(loadedStats);

          // Reload profile
          const userProfile = await loadUserProfile();
          if (!cancelled) setProfile(userProfile);

          const uri = await getAvatarUri();
          if (!cancelled) {
            if (userProfile.avatarUri) {
              setAvatarUri(userProfile.avatarUri);
            } else if (uri) {
              const updated = await updateUserAvatar(uri);
              if (!cancelled) {
                setAvatarUri(uri);
                setProfile(updated);
              }
            }
          }
        } catch (e) {
          console.error("refresh profile on focus:", e);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (tabChangeTimeoutRef.current) {
        clearTimeout(tabChangeTimeoutRef.current);
      }
    };
  }, []);

  // Handle tab parameter from URL (e.g., /leistung?tab=streak)
  useEffect(() => {
    if (tab === "streak" || tab === "level" || tab === "gallery" || tab === "times") {
      setActiveTab(tab);
      setVisitedTabs(prev => ({ ...prev, [tab]: true }));

      // Scroll so tab nav scrolls out of view, only content is visible
      setTimeout(() => {
        if (scrollViewRef.current && tabSectionY > 0) {
          scrollViewRef.current.scrollTo({
            x: 0,
            y: tabSectionY + 72,
            animated: true,
          });
        }
      }, 150);
    }
  }, [tab, tabSectionY]);

  const tabs: TabItem[] = [
    { id: "level", label: t('tabs.level') },
    { id: "gallery", label: t('tabs.gallery') },
    { id: "streak", label: t('tabs.streak') },
    { id: "times", label: t('tabs.times') },
  ];

  const handleTabChange = (tabId: string) => {
    const id = tabId as TabId;
    setActiveTab(id);

    // Tab als besucht markieren (lazy loading)
    if (!visitedTabs[id]) {
      setVisitedTabs(prev => ({ ...prev, [id]: true }));
    }

    // Clear previous timeout to prevent memory leaks
    if (tabChangeTimeoutRef.current) {
      clearTimeout(tabChangeTimeoutRef.current);
    }

    // Scroll so tab nav scrolls out of view, only content is visible
    tabChangeTimeoutRef.current = setTimeout(() => {
      if (scrollViewRef.current && tabSectionY > 0) {
        scrollViewRef.current.scrollTo({ x: 0, y: tabSectionY + 72, animated: true });
      }
    }, 100);
  };

  const handleTabSectionLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    setTabSectionY(y);
  };



  // Profiländerungen
  const handleNameChange = async (name: string) => {
    try {
      const updatedProfile = await updateUserName(name);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  const handleAvatarChange = async (uri: string | null) => {
    try {
      const updatedProfile = await updateUserAvatar(uri);
      setAvatarUri(uri);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating avatar:", error);
      showAlert({
        title: "Fehler",
        message: "Das Profilbild konnte nicht gespeichert werden. Bitte versuche es erneut.",
        type: "error",
        buttons: [{ text: "OK", style: "primary" }],
      });
    }
  };

  const handleTitleChange = async (levelIndex: number | null) => {
    try {
      const updated = await updateUserTitle(levelIndex);
      setProfile(updated);
      setShowTitleModal(false);
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const handleTitlePress = () => {
    // Modal sofort öffnen - kein Tab-Wechsel mehr nötig
    setShowTitleModal(true);
  };

  // Stats Card Navigation Handlers
  const handleXPPress = () => {
    handleTabChange("level");
  };

  const handlePicturesPress = () => {
    // Navigate directly to gallery screen without tab change
    router.push("/gallery");
  };

  const handleStreakPress = () => {
    handleTabChange("streak");
  };

  const handleOpenSettings = () => {
    cameFromSettings.current = true;
    cogwheelRotation.value = withTiming(cogwheelRotation.value + 360, {
      duration: 500,
      easing: Easing.out(Easing.cubic),
    });
    router.push("/settings");
  };
  const handleOpenSupportShop = () => setShowSupportShop(true);
  const handleCloseSupportShop = () => setShowSupportShop(false);

  // Get title string from titleLevelIndex
  const getTitleString = (): string | null => {
    if (profile.titleLevelIndex === null || profile.titleLevelIndex === undefined) {
      return null;
    }
    const allLevels = getLevels();
    return allLevels[profile.titleLevelIndex]?.name || null;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <View style={styles.loadingWrapper}>
          <TouchableOpacity
            style={[styles.settingsButtonScrolling, { top: insets.top - 20 }]}
            onPress={handleOpenSettings}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.View style={cogwheelAnimatedStyle}>
              <CogwheelIcon width={40} height={40} fill={colors.textSecondary} />
            </Animated.View>
          </TouchableOpacity>
          <LoadingState />
        </View>
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <TouchableOpacity
          style={[styles.settingsButton, { top: insets.top - 10 }]}
          onPress={handleOpenSettings}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Animated.View style={cogwheelAnimatedStyle}>
            <CogwheelIcon width={40} height={40} fill={colors.textSecondary} />
          </Animated.View>
        </TouchableOpacity>
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 120 }]}
        showsVerticalScrollIndicator
      >
        {/* Profile Header */}
        <View style={styles.profileContainer}>
          {/* Settings Button - inside container, scrolls with content */}
          <TouchableOpacity
            style={[styles.settingsButtonScrolling, { top: insets.top - 20 }]}
            onPress={handleOpenSettings}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Animated.View style={cogwheelAnimatedStyle}>
              <CogwheelIcon width={40} height={40} fill={colors.textSecondary} />
            </Animated.View>
          </TouchableOpacity>
          <ProfileHeader
            stats={stats}
            name={profile.name}
            avatarUri={avatarUri}
            onChangeName={handleNameChange}
            onChangeAvatar={handleAvatarChange}
            completedLandscapesCount={landscapes.length}
            title={getTitleString()}
            onTitlePress={handleTitlePress}
            onXPPress={handleXPPress}
            onPicturesPress={handlePicturesPress}
            onStreakPress={handleStreakPress}
          />
        </View>

        {/* Tab Navigation - normal position */}
        <View style={styles.tabSection} onLayout={handleTabSectionLayout}>
          <TabNavigator tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        </View>

        <View style={styles.tabContentContainer}>
          {/* Level Tab - immer gemounted (Initial-Tab) */}
          <View style={{ display: activeTab === 'level' ? 'flex' : 'none' }}>
            <LevelTab
              stats={stats}
              selectedTitleIndex={profile.titleLevelIndex ?? null}
              onTitleSelect={handleTitleChange}
            />
          </View>

          {/* Gallery Tab - lazy gemounted */}
          {visitedTabs.gallery && (
            <View style={{ display: activeTab === 'gallery' ? 'flex' : 'none' }}>
              <GalleryTab stats={stats} />
            </View>
          )}

          {/* Streak Tab - lazy gemounted */}
          {visitedTabs.streak && (
            <View style={{ display: activeTab === 'streak' ? 'flex' : 'none' }}>
              <StreakTab stats={stats} onOpenSupportShop={handleOpenSupportShop} />
            </View>
          )}

          {/* Achievements Tab - lazy gemounted */}
          {visitedTabs.times && (
            <View style={{ display: activeTab === 'times' ? 'flex' : 'none' }}>
              <AchievementsTab stats={stats} />
            </View>
          )}
        </View>

        {/* Support Banner - unterhalb der Tab-Inhalte */}
        <View style={styles.bannerContainer}>
          <SupportBanner onOpenSupportShop={handleOpenSupportShop} />
        </View>
      </Animated.ScrollView>


      {showSupportShop && <SupportShopScreen onClose={handleCloseSupportShop} />}

      {/* Title Picker Modal - optimized with useMemo */}
      <TitlePickerModal
        visible={showTitleModal}
        onClose={() => setShowTitleModal(false)}
        titles={titleOptions}
        selectedTitleIndex={profile.titleLevelIndex ?? null}
        onSelectTitle={handleTitleChange}
        isDark={theme.isDark}
        textPrimaryColor={colors.textPrimary}
        textSecondaryColor={colors.textSecondary}
        surfaceColor={colors.surface}
        borderColor={colors.border}
        progressColor={progressColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  scrollContent: {},
  settingsButton: {
    position: "absolute",
    right: 16,
    zIndex: 20,
  },
  settingsButtonScrolling: {
    position: "absolute",
    right: 16,
    zIndex: 10,
  },
  loadingWrapper: { flex: 1, marginTop: 24 },
  profileContainer: { paddingHorizontal: 16, marginTop: 24, marginBottom: 8 },
  tabSection: {
    width: "100%",
  },
  tabContentContainer: { marginTop: 8 },
  bannerContainer: { paddingHorizontal: 16, marginTop: 8 },
});

export default Leistung;
