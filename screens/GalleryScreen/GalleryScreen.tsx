// screens/GalleryScreen/GalleryScreen.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
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
import {
  LandscapeCategory,
  sortLandscapesForGallery,
} from "@/screens/GalleryScreen/utils/landscapes/data";
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
import { useIsFocused } from "@react-navigation/native";

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
  const isFocused = useIsFocused();

  // Get screen dimensions for responsive design
  const { width: screenWidth } = useWindowDimensions();

  // Use the correct navigation context hook
  const { hideNavigation } = useNavigation();

  // Animated values for tab indicator
  const indicatorPosition = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);

  // Hide bottom navigation more aggressively
  useEffect(() => {
    hideNavigation();
    const timer = setTimeout(() => {
      hideNavigation();
    }, 100);
    return () => clearTimeout(timer);
  }, [hideNavigation]);

  // States
  const [activeTab, setActiveTab] = useState<LandscapeFilter>("all");
  const [selectedLandscape, setSelectedLandscape] = useState<Landscape | null>(
    null
  );
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<
    LandscapeCategory[]
  >([]);
  const [tabLayouts, setTabLayouts] = useState<{
    [key: string]: { x: number; width: number };
  }>({});

  // Key, um bei jedem Fokus die Gruppe (5) neu zu mischen
  const [shuffleKey, setShuffleKey] = useState(0);
  useEffect(() => {
    if (isFocused) setShuffleKey((k) => k + 1);
  }, [isFocused]);

  // Determine display mode based on screen size
  const isCompactMode = screenWidth < 370;
  const isSmallMode = screenWidth < 420 && screenWidth >= 370;

  // useLandscapes liefert sowohl eine (ggf. gefilterte) Liste als auch die Collection
  const {
    landscapes: hookLandscapes, // vom Hook sortiert/gefiltert je nach activeTab
    isLoading,
    toggleFavorite,
    changeFilter,
    reload,
    collection, // enthält { landscapes: Record<string, Landscape>, favorites, currentImageId, ... }
    setCurrentProject,
  } = useLandscapes(activeTab);

  // Animated indicator follows active tab
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
  }, [activeTab, tabLayouts, indicatorPosition, indicatorWidth]);

  // Animated style for the tab indicator
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorPosition.value }],
    width: indicatorWidth.value,
  }));

  // Tab data with responsive labels
  const tabs = useMemo(() => {
    if (isCompactMode) {
      return [
        {
          id: "all" as LandscapeFilter,
          label: "Alle",
          shortLabel: "Alle",
          icon: "grid",
        },
        {
          id: "inProgress" as LandscapeFilter,
          label: "In Arbeit",
          shortLabel: "Offen",
          icon: "clock",
        },
        {
          id: "completed" as LandscapeFilter,
          label: "Komplett",
          shortLabel: "OK",
          icon: "check-circle",
        },
        {
          id: "favorites" as LandscapeFilter,
          label: "Favoriten",
          shortLabel: "Favs",
          icon: "heart",
        },
      ];
    } else if (isSmallMode) {
      return [
        {
          id: "all" as LandscapeFilter,
          label: "Alle",
          shortLabel: "Alle",
          icon: "grid",
        },
        {
          id: "inProgress" as LandscapeFilter,
          label: "In Arbeit",
          shortLabel: "Offen",
          icon: "clock",
        },
        {
          id: "completed" as LandscapeFilter,
          label: "Komplett",
          shortLabel: "Komplett",
          icon: "check-circle",
        },
        {
          id: "favorites" as LandscapeFilter,
          label: "Favoriten",
          shortLabel: "Favoriten",
          icon: "heart",
        },
      ];
    } else {
      return [
        {
          id: "all" as LandscapeFilter,
          label: "Alle",
          shortLabel: "Alle",
          icon: "grid",
        },
        {
          id: "inProgress" as LandscapeFilter,
          label: "In Arbeit",
          shortLabel: "Offen",
          icon: "clock",
        },
        {
          id: "completed" as LandscapeFilter,
          label: "Komplett",
          shortLabel: "Komplett",
          icon: "check-circle",
        },
        {
          id: "favorites" as LandscapeFilter,
          label: "Favoriten",
          shortLabel: "Favoriten",
          icon: "heart",
        },
      ];
    }
  }, [isCompactMode, isSmallMode]);

  // Aktuelle Bild-ID für das Freischalten
  const currentImageId = collection?.currentImageId || "";

  
  // ---- Zentrale Stelle: Reihenfolge bestimmen ----
  // Für alle Tabs nutzen wir die spezielle Sortierung, aber mit gefilterten Daten
  const baseList: Landscape[] = useMemo(() => {
    if (!collection) return hookLandscapes;

    // Für "all" Tab: verwende die spezielle Sortierung mit allen Bildern
    if (activeTab === "all") {
      return sortLandscapesForGallery(collection);
    }

    // Für "inProgress" Tab: zeige ALLE nicht-kompletten Bilder
    if (activeTab === "inProgress") {
      // Erstelle eine gefilterte Collection mit allen nicht-kompletten Bildern
      const filteredCollection = {
        ...collection,
        landscapes: Object.fromEntries(
          Object.entries(collection.landscapes).filter(
            ([_, landscape]) => !landscape.isComplete
          )
        ),
        currentImageId: collection.currentImageId,
        favorites: collection.favorites,
      };
      return sortLandscapesForGallery(filteredCollection);
    }

    // Für "completed" Tab: zeige alle kompletten Bilder (inkl. dem mit progress === 9)
    if (activeTab === "completed") {
      // Erstelle eine gefilterte Collection nur mit kompletten Bildern
      const filteredCollection = {
        ...collection,
        landscapes: Object.fromEntries(
          Object.entries(collection.landscapes).filter(
            ([_, landscape]) => landscape.isComplete || landscape.progress === 9
          )
        ),
        // WICHTIG: currentImageId auf null setzen, damit es nicht an Position 1 kommt
        currentImageId: null,
        favorites: collection.favorites,
      };
      return sortLandscapesForGallery(filteredCollection);
    }

    // Für "favorites" Tab: zeige alle favorisierten kompletten Bilder
    if (activeTab === "favorites") {
      // Erstelle eine gefilterte Collection nur mit favorisierten kompletten Bildern
      const filteredCollection = {
        ...collection,
        landscapes: Object.fromEntries(
          Object.entries(collection.landscapes).filter(
            ([_, landscape]) =>
              landscape.isFavorite &&
              (landscape.isComplete || landscape.progress === 9)
          )
        ),
        // WICHTIG: currentImageId auf null setzen, damit es nicht an Position 1 kommt
        currentImageId: null,
        favorites: collection.favorites,
      };
      return sortLandscapesForGallery(filteredCollection);
    }

    // Fallback: verwende die vom Hook gefilterten Daten
    return hookLandscapes;
  }, [collection, hookLandscapes, activeTab, shuffleKey]);

  // Danach (optional) Kategorie-Filter anwenden
  const landscapes = useMemo(() => {
    if (selectedCategories.length === 0) return baseList;
    return baseList.filter((l) =>
      selectedCategories.includes(l.category as LandscapeCategory)
    );
  }, [baseList, selectedCategories]);

  // Handler for image tap
  const handleImagePress = (landscape: Landscape) => {
    setSelectedLandscape(landscape);
    setDetailModalVisible(true);
  };

  // Handler for favorite toggle - optimized to prevent full reloads
  const handleToggleFavorite = async (landscape: Landscape) => {
    const newStatus = await toggleFavorite(landscape.id);
    landscape.isFavorite = newStatus;
    if (selectedLandscape && selectedLandscape.id === landscape.id) {
      setSelectedLandscape({
        ...selectedLandscape,
        isFavorite: newStatus,
      });
    }
  };

  // Handler: Bild als Projekt wählen (aktuelles Freischaltbild setzen)
  const handleSelectAsProject = async (landscape: Landscape) => {
    const success = await setCurrentProject(landscape.id);
    if (success) {
      showAlert({
        title: "Bild ausgewählt",
        message: `„${landscape.name}" wird nun durch Lösen von Sudokus freigeschaltet.`,
        type: "success",
        buttons: [{ text: "OK", style: "primary" }],
      });
      await reload();
      setTimeout(() => setDetailModalVisible(false), 500);
    }
  };

  // Navigate directly to LeistungScreen instead of going back
  const handleBack = () => {
    router.push("/leistung");
  };

  // Show filter modal
  const showFilterModal = () => setFilterModalVisible(true);

  // Apply filter
  const handleApplyFilter = (categories: LandscapeCategory[]) => {
    setSelectedCategories(categories);
  };

  // Close detail modal
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    setTimeout(() => reload(), 300);
  };

  // Switch tab
  // Switch tab
  const handleTabPress = (tabId: LandscapeFilter) => {
    setActiveTab(tabId);
    changeFilter(tabId); // Direkt den Filter ändern
  };

  // Save the layout of a tab
  const handleTabLayout = (tabId: string, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => ({ ...prev, [tabId]: { x, width } }));
    if (tabId === activeTab && !tabLayouts[tabId]) {
      indicatorPosition.value = x;
      indicatorWidth.value = width;
    }
  };

  // Render tab buttons (unten)
  const renderTabs = () => (
    <View
      style={[
        styles.tabsContainerWrapper,
        {
          backgroundColor: theme.isDark
            ? "rgba(41, 42, 45, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          shadowColor: colors.shadow,
          borderTopColor: theme.isDark
            ? "rgba(255,255,255,0.1)"
            : "rgba(0,0,0,0.05)",
        },
      ]}
    >
      <View
        style={[
          styles.tabsContainer,
          {
            borderTopColor: theme.isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.05)",
          },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const showTabText = !isCompactMode;
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
                      ? "rgba(138, 180, 248, 0.12)"
                      : "rgba(66, 133, 244, 0.08)",
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

  const backgroundColor = colors.background;

  // Counts für Filter-Modal
  const totalImages = hookLandscapes.length;
  const filteredCount = landscapes.length;
  const getPreviewFilteredCount = (categories: LandscapeCategory[]) => {
    if (categories.length === 0) return totalImages;
    return hookLandscapes.filter((l) =>
      categories.includes(l.category as LandscapeCategory)
    ).length;
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <StatusBar hidden={true} />

      {/* Header */}
      <Header
        title="Deine Sammlung"
        onBackPress={handleBack}
        rightAction={{ icon: "filter", onPress: showFilterModal }}
      />

      {/* Aktive Filter-Badge */}
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

      {/* Inhalt */}
      <Animated.View
        style={[styles.content, { paddingBottom: insets.bottom + 60 }]}
        entering={FadeIn.duration(400)}
      >
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

      {/* Tabs unten */}
      <View
        style={[styles.bottomTabContainer, { paddingBottom: insets.bottom }]}
      >
        {renderTabs()}
      </View>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        selectedCategories={selectedCategories}
        onApplyFilter={handleApplyFilter}
        totalImages={totalImages}
        filteredCount={filteredCount}
        allLandscapes={hookLandscapes}
      />

      {/* Detail-Modal */}
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
