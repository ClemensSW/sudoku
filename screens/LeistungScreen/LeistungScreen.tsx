// screens/LeistungScreen/LeistungScreen.tsx
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
  UserProfile,
} from "@/utils/profileStorage";
import { getAvatarUri } from "@/utils/avatarStorage";
import Header from "@/components/Header/Header";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import { useLandscapes } from "@/screens/GalleryScreen/hooks/useLandscapes";
import { useAlert } from "@/components/CustomAlert/AlertProvider";

// Components
import ProfileHeader from "./components/ProfileHeader";
import TabNavigator from "./components/TabNavigator";
import type { TabItem } from "./components/TabNavigator";
import LevelTab from "./components/LevelTab";
import GalleryTab from "./components/GalleryTab";
import StreakTab from "./components/StreakTab";
import TimeTab from "./components/TimeTab";

// Tab IDs
type TabId = "level" | "gallery" | "streak" | "times";

const LeistungScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  
  // Add a ref to the ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  // Add a ref to track the tab section position
  const tabSectionPosition = useRef<number>(0);

  // States
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>("level");
  const [profile, setProfile] = useState<UserProfile>({ name: "User" });
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // Use landscapes hook to get completed images count
  const { landscapes, isLoading: isLoadingLandscapes } =
    useLandscapes("completed");

  // Load all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Load game stats
        const loadedStats = await loadStats();
        setStats(loadedStats);

        // Load user profile
        const userProfile = await loadUserProfile();
        setProfile(userProfile);

        // Load avatar (if exists)
        const uri = await getAvatarUri();
        // First check if profile already has a reference to an avatar
        if (userProfile.avatarUri) {
          setAvatarUri(userProfile.avatarUri);
        }
        // If not, check if there's a standalone avatar in the filesystem
        else if (uri) {
          // Update the profile with the found avatar
          await updateUserAvatar(uri);
          setAvatarUri(uri);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Tab configuration
  const tabs: TabItem[] = [
    { id: "level", label: "Level" },
    { id: "gallery", label: "Sammlung" },
    { id: "streak", label: "Serie" },
    { id: "times", label: "Zeiten" },
  ];

  // Handle tab change with scrolling to content
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId as TabId);
    
    // Scroll to the tab section with a slight delay to allow for state update
    setTimeout(() => {
      if (scrollViewRef.current && tabSectionPosition.current > 0) {
        // Scroll to the tab section position
        scrollViewRef.current.scrollTo({
          y: tabSectionPosition.current - 20, // Subtract a small offset for better visibility
          animated: true
        });
      }
    }, 100);
  };

  // Measure the position of the tab section
  const handleTabSectionLayout = (event: any) => {
    const { y } = event.nativeEvent.layout;
    tabSectionPosition.current = y;
  };

  // Handle name change
  const handleNameChange = async (name: string) => {
    try {
      const updatedProfile = await updateUserName(name);
      setProfile(updatedProfile);
    } catch (error) {
      console.error("Error updating name:", error);
    }
  };

  // handleAvatarChange function in LeistungScreen.tsx
  const handleAvatarChange = async (uri: string | null) => {
    try {
      const updatedProfile = await updateUserAvatar(uri);
      setAvatarUri(uri); // Direct state update
      setProfile(updatedProfile);

      // Debug output
      console.log("Avatar updated:", uri);
      console.log("Updated profile:", updatedProfile);
    } catch (error) {
      console.error("Error updating avatar:", error);
      showAlert({
        title: "Fehler",
        message:
          "Das Profilbild konnte nicht gespeichert werden. Bitte versuche es erneut.",
        type: "error",
        buttons: [{ text: "OK", style: "primary" }],
      });
    }
  };

  // Settings button handler
  const handleOpenSettings = () => {
    router.push("/settings");
  };

  // Render the active tab content
  const renderTabContent = () => {
    if (!stats) return null;

    switch (activeTab) {
      case "level":
        return <LevelTab stats={stats} />;
      case "gallery":
        return <GalleryTab />;
      case "streak":
        return <StreakTab stats={stats} />;
      case "times":
        return <TimeTab stats={stats} />;
      default:
        return <LevelTab stats={stats} />;
    }
  };

  // Show loading state while data is loading
  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Header
          title="Meine Leistung"
          rightAction={{
            icon: "settings",
            onPress: handleOpenSettings,
          }}
        />
        <LoadingState />
      </View>
    );
  }

  // Show empty state if no stats available
  if (!stats) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar style={theme.isDark ? "light" : "dark"} />
        <Header
          title="Meine Leistung"
          rightAction={{
            icon: "settings",
            onPress: handleOpenSettings,
          }}
        />
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Header - Fixed at the top */}
      <Header
        title="Meine Leistung"
        rightAction={{
          icon: "settings",
          onPress: handleOpenSettings,
        }}
      />

      {/* ScrollView for ALL content (including profile and tabs) */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 20 }, // Add extra padding at bottom for safe area
        ]}
        showsVerticalScrollIndicator={true}
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
          />
        </View>

        {/* Tab Navigator - This will scroll with the content */}
        <View 
          style={styles.tabSection}
          onLayout={handleTabSectionLayout}
        >
          <TabNavigator
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        </View>

        {/* Tab Content */}
        <View style={styles.tabContentContainer}>{renderTabContent()}</View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    // No horizontal padding - it will be handled by the child components
  },
  profileContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  tabSection: {
    width: "100%", // Full width
  },
  tabContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 64,
  },
});

export default LeistungScreen;