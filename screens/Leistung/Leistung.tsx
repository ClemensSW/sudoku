import React, { useState, useEffect, useRef, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedScrollHandler, useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
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
import Header from "@/components/Header/Header";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import { useLandscapes } from "@/screens/Gallery/hooks/useLandscapes";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { useFocusEffect } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

// Components
import ProfileHeader from "./components/ProfileHeader";
import TabNavigator from "./components/TabNavigator";
import type { TabItem } from "./components/TabNavigator";
import LevelTab from "./components/LevelTab";
import GalleryTab from "./components/GalleryTab";
import StreakTab from "./components/StreakTab";
import TimeTab from "./components/TimeTab";

// Support
import SupportBanner from "./components/SupportBanner/SupportBanner";
import SupportShopScreen from "@/screens/SupportShop";

type TabId = "level" | "gallery" | "streak" | "times";

const Leistung: React.FC = () => {
  const { t } = useTranslation('leistung');
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const scrollViewRef = useRef<Animated.ScrollView>(null);
  const tabSectionPosition = useSharedValue(0);
  const [headerHeight, setHeaderHeight] = useState<number>(60);
  const scrollY = useSharedValue(0);

  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("level");
  const [profile, setProfile] = useState<UserProfile>({ name: "User", title: null });
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [showTitleModal, setShowTitleModal] = useState(false);

  const [showSupportShop, setShowSupportShop] = useState(false);
  const { landscapes } = useLandscapes("completed");

  // Progress color for title modal
  const progressColor = useProgressColor(stats?.totalXP || 0);

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

  // Initial-Load
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
  }, []);

  // **NEU**: Refresh bei Fokus (Titel/Avatar nach Modal-Änderungen)
  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
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

  const tabs: TabItem[] = [
    { id: "level", label: t('tabs.level') },
    { id: "gallery", label: t('tabs.collection') },
    { id: "streak", label: t('tabs.streak') },
    { id: "times", label: t('tabs.times') },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);

    // Scroll to tab navigation if it's below the header
    setTimeout(() => {
      if (scrollViewRef.current && tabSectionPosition.value > 0) {
        const targetPosition = tabSectionPosition.value; // Scroll exactly to tab position
        scrollViewRef.current.scrollTo({ x: 0, y: targetPosition, animated: true });
      }
    }, 100);
  };

  const handleTabSectionLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    tabSectionPosition.value = y;
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  // Animated style for sticky tab overlay
  const stickyTabAnimatedStyle = useAnimatedStyle(() => {
    const threshold = tabSectionPosition.value - 10;
    const shouldBeVisible = scrollY.value >= threshold && tabSectionPosition.value > 0;
    return {
      transform: [
        {
          translateY: shouldBeVisible ? 0 : -200,
        },
      ],
      opacity: shouldBeVisible ? 1 : 0,
    };
  });

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

  const handleOpenSettings = () => router.push("/settings");
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

  const renderTabContent = () => {
    if (!stats) return null;
    switch (activeTab) {
      case "level":
        return (
          <LevelTab
            stats={stats}
            selectedTitleIndex={profile.titleLevelIndex ?? null}
            onTitleSelect={handleTitleChange}
          />
        );
      case "gallery":
        return <GalleryTab stats={stats} />;
      case "streak":
        return <StreakTab stats={stats} />;
      case "times":
        return <TimeTab stats={stats} />;
      default:
        return (
          <LevelTab
            stats={stats}
            selectedTitleIndex={profile.titleLevelIndex ?? null}
            onTitleSelect={handleTitleChange}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Header title={t('headerTitle')} rightAction={{ icon: "settings", onPress: handleOpenSettings }} />
        <LoadingState />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Header title={t('headerTitle')} rightAction={{ icon: "settings", onPress: handleOpenSettings }} />
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <View onLayout={(e) => {
        const height = e.nativeEvent.layout.height;
        setHeaderHeight(height);
      }}>
        <Header title={t('headerTitle')} rightAction={{ icon: "settings", onPress: handleOpenSettings }} />
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        {/* Profile Header */}
        <View style={styles.profileContainer}>
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

        {/* Support Banner - unterhalb der Tabs */}
        <View style={styles.bannerContainer}>
          <SupportBanner onOpenSupportShop={handleOpenSupportShop} />
        </View>

        <View style={styles.tabContentContainer}>
          {activeTab === "gallery" ? (
            <GalleryTab stats={stats} />
          ) : activeTab === "times" ? (
            <TimeTab stats={stats} />
          ) : (
            renderTabContent()
          )}
        </View>
      </Animated.ScrollView>

      {/* Sticky Tab Navigation Overlay */}
      <Animated.View
        style={[
          styles.stickyTabOverlay,
          { backgroundColor: colors.background, top: headerHeight },
          stickyTabAnimatedStyle,
        ]}
        pointerEvents="box-none"
      >
        <TabNavigator tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
      </Animated.View>

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
  profileContainer: { paddingHorizontal: 16, marginTop: 16, marginBottom: 16 },
  tabSection: {
    width: "100%",
  },
  stickyTabOverlay: {
    position: "absolute",
    // top is set dynamically based on headerHeight
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  bannerContainer: { paddingHorizontal: 16, marginTop: 20, marginBottom: 16 },
  tabContentContainer: {paddingBottom: 64 },
});

export default Leistung;
