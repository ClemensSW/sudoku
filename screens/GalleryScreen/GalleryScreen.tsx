// screens/GalleryScreen/GalleryScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity, SafeAreaView, Dimensions, useWindowDimensions } from "react-native";
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
import { LandscapeCategory } from "@/screens/GalleryScreen/utils/landscapes/data";
import { useLandscapes } from "@/screens/GalleryScreen/hooks/useLandscapes";
import {
  ImageGrid,
  ImageDetailModal,
} from "@/screens/GalleryScreen/components/LandscapeCollection";
import { FilterModal } from "@/screens/GalleryScreen/components/FilterModal";
import Header from "@/components/Header/Header";
import { useNavigation } from "@/utils/NavigationContext";
import { StatusBar } from "expo-status-bar";
import styles from "./GalleryScreen.styles";
import { ThemeColors } from "@/utils/theme/types";
import { useAlert } from "@/components/CustomAlert/AlertProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
      "Du hast noch kein Bild, an den du arbeitest. Löse ein Sudoku, um zu beginnen!",
    completed:
      "Du hast noch kein Bild vollständig freigeschaltet. Löse 9 Sudokus, um dein erstes Bild freizuschalten!",
    favorites:
      "Du hast noch kein Bild als Favoriten markiert. Markiere freigeschaltete Bilder mit dem Herz-Symbol.",
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
  const { showAlert } = useAlert();
  const insets = useSafeAreaInsets();
  
  // Get screen dimensions for responsive design
  const { width: screenWidth } = useWindowDimensions();

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<LandscapeCategory[]>([]);
  const [tabLayouts, setTabLayouts] = useState<{
    [key: string]: { x: number; width: number };
  }>({});

  // Determine display mode based on screen size
  const isCompactMode = screenWidth < 370; // Threshold for smaller screens
  const isSmallMode = screenWidth < 420 && screenWidth >= 370; // Middle size screens
  
  // Use the useLandscapes Hook mit erweiterten Funktionen
  const {
    landscapes: allLandscapes,
    isLoading,
    toggleFavorite,
    changeFilter,
    reload,
    collection,
    setCurrentProject
  } = useLandscapes(activeTab);

  // Filter landscapes by selected categories
  const landscapes = useMemo(() => {
    // Wenn keine Kategorien ausgewählt sind, zeige alle
    if (selectedCategories.length === 0) {
      return allLandscapes;
    }
    // Filtere nach ausgewählten Kategorien
    return allLandscapes.filter(landscape => 
      selectedCategories.includes(landscape.category as LandscapeCategory)
    );
  }, [allLandscapes, selectedCategories]);

  // Berechne die aktuelle Bild-ID für das Freischalten
  const currentImageId = collection?.currentImageId || "";

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

  // Tab data with responsive labels
  const tabs = useMemo(() => {
    if (isCompactMode) {
      // For very small screens, use only icons with ultra-short labels
      return [
        { id: "all" as LandscapeFilter, label: "Alle", shortLabel: "Alle", icon: "grid" },
        { id: "inProgress" as LandscapeFilter, label: "In Arbeit", shortLabel: "Aktiv", icon: "clock" },
        { id: "completed" as LandscapeFilter, label: "Komplett", shortLabel: "OK", icon: "check-circle" },
        { id: "favorites" as LandscapeFilter, label: "Favoriten", shortLabel: "Favs", icon: "heart" },
      ];
    } else if (isSmallMode) {
      // For small screens, use short labels
      return [
        { id: "all" as LandscapeFilter, label: "Alle", shortLabel: "Alle", icon: "grid" },
        { id: "inProgress" as LandscapeFilter, label: "In Arbeit", shortLabel: "Aktiv", icon: "clock" },
        { id: "completed" as LandscapeFilter, label: "Komplett", shortLabel: "Komplett", icon: "check-circle" },
        { id: "favorites" as LandscapeFilter, label: "Favoriten", shortLabel: "Favoriten", icon: "heart" },
      ];
    } else {
      // For larger screens, use full labels
      return [
        { id: "all" as LandscapeFilter, label: "Alle", shortLabel: "Alle", icon: "grid" },
        { id: "inProgress" as LandscapeFilter, label: "In Arbeit", shortLabel: "In Arbeit", icon: "clock" },
        { id: "completed" as LandscapeFilter, label: "Komplett", shortLabel: "Komplett", icon: "check-circle" },
        { id: "favorites" as LandscapeFilter, label: "Favoriten", shortLabel: "Favoriten", icon: "heart" },
      ];
    }
  }, [isCompactMode, isSmallMode]);

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

  // Handler für die Bildauswahl
  const handleSelectAsProject = async (landscape: Landscape) => {
    const success = await setCurrentProject(landscape.id);
    
    if (success) {
      // Feedback für den Nutzer anzeigen
      showAlert({
        title: "Bild ausgewählt",
        message: `„${landscape.name}" wird nun durch Lösen von Sudokus freigeschaltet.`,
        type: "success",
        buttons: [{ text: "OK", style: "primary" }],
      });
      
      // Daten aktualisieren - vollständig neu laden
      await reload();
      
      // Detail-Modal schließen mit Verzögerung
      setTimeout(() => {
        setDetailModalVisible(false);
      }, 500);
    }
  };

  // Navigate directly to LeistungScreen instead of going back
  const handleBack = () => {
    router.push("/leistung");
  };

  // Show filter modal
  const showFilterModal = () => {
    setFilterModalVisible(true);
  };

  // Apply filter
  const handleApplyFilter = (categories: LandscapeCategory[]) => {
    setSelectedCategories(categories);
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

  // Render tab buttons - jetzt am unteren Bildschirmrand mit responsivem Design
  const renderTabs = () => {
    return (
      <View
        style={[
          styles.tabsContainerWrapper,
          {
            backgroundColor: theme.isDark
              ? "rgba(41, 42, 45, 0.95)" // Leicht transparentes surface (#292A2D)
              : "rgba(255, 255, 255, 0.95)", // Leicht transparentes Weiß
            shadowColor: theme.isDark
              ? colors.shadow // "rgba(0, 0, 0, 0.3)"
              : colors.shadow, // "rgba(60, 64, 67, 0.10)"
            borderTopColor: theme.isDark
              ? "rgba(255,255,255,0.1)"  // Helle Farbe im dunklen Modus
              : "rgba(0,0,0,0.05)",      // Dunkle Farbe im hellen Modus
          },
        ]}
      >
        <View
          style={[
            styles.tabsContainer,
            {
              borderTopColor: theme.isDark
                ? "rgba(255,255,255,0.1)"  // Helle Farbe im dunklen Modus
                : "rgba(0,0,0,0.05)",      // Dunkle Farbe im hellen Modus
            },
          ]}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            
            // Determine if we should show text based on screen size
            const showTabText = !isCompactMode;
            
            // Use the appropriate label based on screen size
            const tabLabel = isSmallMode ? tab.shortLabel : tab.label;

            return (
              <TouchableOpacity
                key={tab.id}
                style={[
                  styles.tabButton,
                  isCompactMode ? styles.compactTabButton : null,
                  isSmallMode ? styles.smallTabButton : null,
                  isActive && [
                    styles.activeTabButton,
                    {
                      backgroundColor: theme.isDark
                        ? "rgba(138, 180, 248, 0.12)" // Leicht transparentes primaryLight
                        : "rgba(66, 133, 244, 0.08)", // Subtile Primärfarbe
                    },
                  ],
                ]}
                onPress={() => handleTabPress(tab.id)}
                onLayout={(e) => handleTabLayout(tab.id, e)}
              >
                <Feather
                  name={tab.icon as any}
                  size={isCompactMode ? 18 : 16}
                  color={isActive ? colors.primary : colors.textSecondary}
                  style={showTabText ? styles.tabIcon : undefined}
                />
                {showTabText && (
                  <Text
                    style={[
                      styles.tabText,
                      isSmallMode && styles.smallTabText,
                      { color: isActive ? colors.primary : colors.textSecondary },
                      isActive && styles.activeTabText,
                    ]}
                    numberOfLines={1}
                  >
                    {tabLabel}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Animated indicator - jetzt oben statt unten */}
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

  const backgroundColor = colors.background;

  // Get count of total and filtered images
  const totalImages = allLandscapes.length;
  const filteredCount = landscapes.length;
  
  // Calculate preview count for filter modal
  const getPreviewFilteredCount = (categories: LandscapeCategory[]) => {
    if (categories.length === 0) return totalImages;
    return allLandscapes.filter(landscape => 
      categories.includes(landscape.category as LandscapeCategory)
    ).length;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor }, // Applied solid background color instead of image
      ]}
    >
      {/* Ensure status bar is in the right mode for the theme */}
      <StatusBar style={theme.isDark ? "light" : "dark"} />

      {/* Header with Filter Button */}
      <Header 
        title="Deine Sammlung" 
        onBackPress={handleBack} 
        rightAction={{
          icon: "filter",
          onPress: showFilterModal
        }}
      />

      {/* Show active filter count if filters are applied */}
      {selectedCategories.length > 0 && (
        <View style={[styles.filterBadge, { backgroundColor: colors.surface }]}>
          <Feather name="filter" size={14} color={colors.primary} />
          <Text style={[styles.filterBadgeText, { color: colors.textPrimary }]}>
            {selectedCategories.length} Filter aktiv
          </Text>
          <TouchableOpacity
            onPress={() => setSelectedCategories([])}
            style={styles.filterClearButton}
          >
            <Feather name="x" size={14} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Content - Now with space at the bottom for tabs */}
      <Animated.View 
        style={[
          styles.content, 
          { paddingBottom: insets.bottom + 60 } // Add space for bottom tabs + safe area
        ]} 
        entering={FadeIn.duration(400)}
      >
        {/* Main content area */}
        <View style={styles.galleryContent}>
          {landscapes.length > 0 ? (
            <ImageGrid
              landscapes={landscapes}
              isLoading={isLoading}
              onImagePress={handleImagePress}
              onToggleFavorite={handleToggleFavorite}
              currentImageId={currentImageId}
            />
          ) : (
            <EmptyState activeTab={activeTab} router={router} colors={colors} />
          )}
        </View>
      </Animated.View>

      {/* Bottom Tab Navigation */}
      <SafeAreaView style={styles.bottomTabContainer}>
        {renderTabs()}
      </SafeAreaView>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategories={selectedCategories}
        onApplyFilter={handleApplyFilter}
        totalImages={totalImages}
        filteredCount={filteredCount}
        allLandscapes={allLandscapes}
      />

      {/* Detail Modal mit allen neuen Props */}
      <ImageDetailModal
        visible={detailModalVisible}
        landscape={selectedLandscape}
        onClose={handleCloseDetailModal}
        onToggleFavorite={handleToggleFavorite}
        onSelectAsProject={handleSelectAsProject}
        currentImageId={currentImageId}
      />
    </View>
  );
};

export default GalleryScreen;