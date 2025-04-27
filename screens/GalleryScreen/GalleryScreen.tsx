// screens/GalleryScreen/GalleryScreen.tsx
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, Router } from "expo-router";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import {
  Landscape,
  LandscapeFilter,
} from "@/screens/GalleryScreen/utils/landscapes/types";
import { useLandscapes } from "@/screens/GalleryScreen/hooks/useLandscapes";
import { ImageGrid, ImageDetailModal } from "@/components/LandscapeCollection";
import Header from "@/components/Header/Header";
import { useNavigation } from "@/utils/NavigationContext";
import { StatusBar } from "expo-status-bar";
import styles from "./GalleryScreen.styles";
import { ThemeColors } from "@/utils/theme/types";

// Properly define the props for EmptyState component
interface EmptyStateProps {
  activeTab: LandscapeFilter;
  router: Router;
  colors: ThemeColors;
}

// Empty state component extracted for cleaner code
const EmptyState: React.FC<EmptyStateProps> = ({
  activeTab,
  router,
  colors,
}) => {
  // Texts for different filter states
  const emptyStateTexts: Record<LandscapeFilter, string> = {
    all: "Löse Sudokus, um wunderschöne Landschaftsbilder freizuschalten.",
    inProgress:
      "Du hast noch keine Landschaften, an denen du arbeitest. Löse ein Sudoku, um zu beginnen!",
    completed:
      "Du hast noch keine Landschaften vollständig freigeschaltet. Löse 9 Sudokus, um dein erstes Bild freizuschalten!",
    favorites:
      "Du hast noch keine Landschaften als Favoriten markiert. Markiere freigeschaltete Bilder mit dem Herz-Symbol.",
  };

  return (
    <View style={styles.emptyContainer}>
      <Feather
        name={activeTab === "favorites" ? "heart" : "image"}
        size={48}
        color={colors.textSecondary}
        style={{ opacity: 0.5 }}
      />
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        {emptyStateTexts[activeTab]}
      </Text>

      {(activeTab === "completed" || activeTab === "favorites") && (
        <TouchableOpacity
          style={[
            styles.emptyButton,
            { backgroundColor: colors.primary, padding: 12, borderRadius: 8 },
          ]}
          onPress={() => router.push("/game")}
        >
          <Text style={{ color: "#FFFFFF", fontWeight: "bold" }}>
            Neues Sudoku spielen
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const GalleryScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const router = useRouter();

  // Use the correct navigation context hook
  const { hideNavigation } = useNavigation();

  // Animated values for tab indicator
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Hide bottom navigation more aggressively
  useEffect(() => {
    // Hide navigation as soon as component mounts
    hideNavigation();

    // Extra safety check - re-hide navigation after a short delay
    const timer = setTimeout(() => {
      hideNavigation();
    }, 100);

    return () => {
      clearTimeout(timer);
      // No need to reset on unmount as the receiving screen will control its own navigation
    };
  }, [hideNavigation]);

  // States
  const [activeTab, setActiveTab] = useState<LandscapeFilter>("all");
  const [selectedLandscape, setSelectedLandscape] = useState<Landscape | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [tabLayouts, setTabLayouts] = useState<{
    [key: string]: { x: number; width: number };
  }>({});

  // Use the useLandscapes Hook
  const { landscapes, isLoading, toggleFavorite, changeFilter, reload } =
    useLandscapes(activeTab);

  // Change filter when tab changes
  useEffect(() => {
    changeFilter(activeTab);
  }, [activeTab, changeFilter]);

  // Update indicator position when active tab changes
  useEffect(() => {
    if (tabLayouts[activeTab]) {
      indicatorPosition.value = withTiming(tabLayouts[activeTab].x, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      indicatorWidth.value = withTiming(tabLayouts[activeTab].width, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [activeTab, tabLayouts]);

  // Animated style for the tab indicator
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
    width: indicatorWidth.value,
  }));

  // Tab data
  const tabs: Array<{ id: LandscapeFilter; label: string; icon: string }> = [
    { id: "all", label: "Alle", icon: "grid" },
    { id: "inProgress", label: "In Arbeit", icon: "clock" },
    { id: "completed", label: "Komplett", icon: "check-circle" },
    { id: "favorites", label: "Favoriten", icon: "heart" },
  ];

  // Handler for image tap
  const handleImagePress = (landscape: Landscape) => {
    setSelectedLandscape(landscape);
    setDetailModalVisible(true);
  };

  // Handler for favorite toggle - optimized to prevent full reloads
  const handleToggleFavorite = async (landscape: Landscape) => {
    // Toggle only in the storage without triggering a full reload
    const newStatus = await toggleFavorite(landscape.id);

    // Update the local state of the landscape to reflect the change
    // This prevents a full reload of the landscapes array
    landscape.isFavorite = newStatus;

    // If we're in the detail modal, update the selected landscape too
    if (selectedLandscape && selectedLandscape.id === landscape.id) {
      // Set the favorite status in the currently displayed landscape
      setSelectedLandscape({
        ...selectedLandscape,
        isFavorite: newStatus,
      });
    }
  };

  // Navigate directly to LeistungScreen instead of going back
  const handleBack = () => {
    router.push("/leistung");
  };

  // Close detail modal
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);

    // Delay to reload data after closing
    setTimeout(() => {
      reload();
    }, 300);
  };

  // Switch tab
  const handleTabPress = (tabId: LandscapeFilter) => {
    setActiveTab(tabId);
  };

  // Save the layout of a tab
  const handleTabLayout = (tabId: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({
      ...prev,
      [tabId]: { x, width },
    }));

    // If this is the initial active tab, set the indicator position immediately
    if (tabId === activeTab && !tabLayouts[tabId]) {
      indicatorPosition.value = x;
      indicatorWidth.value = width;
    }
  };

  // Render tab buttons
  const renderTabs = () => {
    return (
      <View
        style={[
          styles.tabsContainerWrapper,
          {
            backgroundColor: theme.isDark
              ? "rgba(30, 41, 59, 0.95)"
              : colors.card,
            shadowColor: theme.isDark
              ? "rgba(0, 0, 0, 0.5)"
              : "rgba(0, 0, 0, 0.1)",
          },
        ]}
      >
        <View
          style={[
            styles.tabsContainer,
            {
              borderBottomColor: theme.isDark
                ? "rgba(255,255,255,0.05)"
                : "rgba(0,0,0,0.05)",
            },
          ]}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;

            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  isActive && [
                    styles.activeTabButton,
                    { backgroundColor: `${colors.primary}10` },
                  ],
                ]}
                onPress={() => handleTabPress(tab.id)}
                onLayout={(e) => handleTabLayout(tab.id, e)}
              >
                <Feather
                  name={tab.icon as any}
                  size={16}
                  color={isActive ? colors.primary : colors.textSecondary}
                  style={styles.tabIcon}
                />
                <Text
                  style={[
                    styles.tabText,
                    { color: isActive ? colors.primary : colors.textSecondary },
                    isActive && styles.activeTabText,
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Animated indicator */}
          <Animated.View
            style={[
              styles.tabIndicator,
              { backgroundColor: colors.primary },
              indicatorStyle,
            ]}
          />
        </View>
      </View>
    );
  };

  // Get a suitable background color based on the theme
  const backgroundColor = theme.isDark
    ? "#1A202C" // Dark blue-gray for dark theme
    : "#F5F7FA"; // Light gray for light theme

  return (
    <View
      style={[
        styles.container,
        { backgroundColor }, // Applied solid background color instead of image
      ]}
    >
      {/* Ensure status bar is in the right mode for the theme */}
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Header */}
      <Header title="Deine Sammlung" onBackPress={handleBack} />

      {/* Content */}
      <Animated.View style={styles.content} entering={FadeIn.duration(400)}>
        {/* Tabs */}
        {renderTabs()}

        {/* Main content area with adjusted padding for better spacing */}
        <View style={styles.galleryContent}>
          {landscapes.length > 0 ? (
            <ImageGrid
              landscapes={landscapes}
              isLoading={isLoading}
              onImagePress={handleImagePress}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <EmptyState activeTab={activeTab} router={router} colors={colors} />
          )}
        </View>
      </Animated.View>

      {/* Detail Modal */}
      <ImageDetailModal
        visible={detailModalVisible}
        landscape={selectedLandscape}
        onClose={handleCloseDetailModal}
        onToggleFavorite={handleToggleFavorite}
      />
    </View>
  );
};

export default GalleryScreen;
