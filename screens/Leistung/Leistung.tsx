import React, { useState, useEffect, useRef } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
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
import { getAvatarUri } from "@/utils/avatarStorage";
import Header from "@/components/Header/Header";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import { useLandscapes } from "@/screens/Gallery/hooks/useLandscapes";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { useFocusEffect } from "@react-navigation/native";

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
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();

  const scrollViewRef = useRef<ScrollView>(null);
  const tabSectionPosition = useRef<number>(0);

  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("level");
  const [profile, setProfile] = useState<UserProfile>({ name: "User", title: null });
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const [showSupportShop, setShowSupportShop] = useState(false);
  const { landscapes } = useLandscapes("completed");

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
    { id: "level", label: "Level" },
    { id: "gallery", label: "Sammlung" },
    { id: "streak", label: "Serie" },
    { id: "times", label: "Zeiten" },
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
    setTimeout(() => {
      if (scrollViewRef.current && tabSectionPosition.current > 0) {
        scrollViewRef.current.scrollTo({ y: tabSectionPosition.current - 20, animated: true });
      }
    }, 100);
  };

  const handleTabSectionLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    tabSectionPosition.current = y;
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

  const handleTitleChange = async (title: string | null) => {
    try {
      const updated = await updateUserTitle(title);
      setProfile(updated);
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  const handleOpenSettings = () => router.push("/settings");
  const handleOpenSupportShop = () => setShowSupportShop(true);
  const handleCloseSupportShop = () => setShowSupportShop(false);

  const renderTabContent = () => {
    if (!stats) return null;
    switch (activeTab) {
      case "level":
        return (
          <LevelTab
            stats={stats}
            selectedTitle={profile.title ?? null}
            onTitleSelect={handleTitleChange}
          />
        );
      case "gallery":
        return <GalleryTab />;
      case "streak":
        return <StreakTab stats={stats} />;
      case "times":
        return <TimeTab stats={stats} />;
      default:
        return (
          <LevelTab
            stats={stats}
            selectedTitle={profile.title ?? null}
            onTitleSelect={handleTitleChange}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Header title="Meine Leistung" rightAction={{ icon: "settings", onPress: handleOpenSettings }} />
        <LoadingState />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Header title="Meine Leistung" rightAction={{ icon: "settings", onPress: handleOpenSettings }} />
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      <Header title="Meine Leistung" rightAction={{ icon: "settings", onPress: handleOpenSettings }} />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator
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
            title={profile.title ?? null}
          />
        </View>

        {/* Support */}
        <SupportBanner onOpenSupportShop={handleOpenSupportShop} />

        {/* Tabs */}
        <View style={styles.tabSection} onLayout={handleTabSectionLayout}>
          <TabNavigator tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
        </View>

        <View style={styles.tabContentContainer}>
          {activeTab === "gallery" ? (
            <GalleryTab />
          ) : activeTab === "times" ? (
            <TimeTab stats={stats} />
          ) : (
            renderTabContent()
          )}
        </View>
      </ScrollView>

      {showSupportShop && <SupportShopScreen onClose={handleCloseSupportShop} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flex: 1 },
  scrollContent: {},
  profileContainer: { paddingHorizontal: 16, marginTop: 16, marginBottom: 16 },
  tabSection: { width: "100%" },
  tabContentContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 64 },
});

export default Leistung;
