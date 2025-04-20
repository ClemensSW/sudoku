import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, Router } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Landscape, LandscapeFilter } from "@/utils/landscapes/types";
import { useLandscapes } from "@/hooks/useLandscapes";
import { ImageGrid, ImageDetailModal } from "@/components/LandscapeCollection";
import Header from "@/components/Header/Header";
import { useNavigation } from "@/utils/NavigationContext"; // Import the correct navigation context
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
const EmptyState: React.FC<EmptyStateProps> = ({ activeTab, router, colors }) => {
  // Texts for different filter states
  const emptyStateTexts: Record<LandscapeFilter, string> = {
    all: "Löse Sudokus, um wunderschöne Landschaftsbilder freizuschalten.",
    inProgress: "Du hast noch keine Landschaften, an denen du arbeitest. Löse ein Sudoku, um zu beginnen!",
    completed: "Du hast noch keine Landschaften vollständig freigeschaltet. Löse 9 Sudokus, um dein erstes Bild freizuschalten!",
    favorites: "Du hast noch keine Landschaften als Favoriten markiert. Markiere freigeschaltete Bilder mit dem Herz-Symbol."
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
            { backgroundColor: colors.primary, padding: 12, borderRadius: 8 }
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
  const [selectedLandscape, setSelectedLandscape] = useState<Landscape | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Use the useLandscapes Hook
  const { 
    landscapes, 
    isLoading, 
    toggleFavorite, 
    changeFilter,
    reload
  } = useLandscapes(activeTab);
  
  // Change filter when tab changes
  useEffect(() => {
    changeFilter(activeTab);
  }, [activeTab, changeFilter]);
  
  // Tab data
  const tabs: Array<{id: LandscapeFilter, label: string}> = [
    { id: "all", label: "Alle" },
    { id: "inProgress", label: "In Arbeit" },
    { id: "completed", label: "Komplett" },
    { id: "favorites", label: "Favoriten" }
  ];
  
  // Handler for image tap
  const handleImagePress = (landscape: Landscape) => {
    setSelectedLandscape(landscape);
    setDetailModalVisible(true);
  };
  
  // Handler for favorite toggle
  const handleToggleFavorite = async (landscape: Landscape) => {
    await toggleFavorite(landscape.id);
    
    // If we're in the detail modal, update the selected landscape
    if (selectedLandscape && selectedLandscape.id === landscape.id) {
      // Set the favorite status in the currently displayed landscape
      setSelectedLandscape({
        ...selectedLandscape,
        isFavorite: !selectedLandscape.isFavorite
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
  
  // Render tab buttons
  const renderTabs = () => {
    return (
      <View 
        style={[
          styles.tabsContainer, 
          { borderBottomColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }
        ]}
      >
        {tabs.map(tab => {
          const isActive = activeTab === tab.id;
          
          return (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tabButton,
                isActive && [
                  styles.activeTabButton,
                  { backgroundColor: `${colors.primary}15` }
                ],
              ]}
              onPress={() => handleTabPress(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? colors.primary : colors.textSecondary },
                  isActive && styles.activeTabText
                ]}
              >
                {tab.label}
              </Text>
              
              {isActive && (
                <View
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: colors.primary }
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };
  
  // Get a suitable background color based on the theme
  const backgroundColor = theme.isDark 
    ? "#1A202C" // Dark blue-gray for dark theme
    : "#F5F7FA"; // Light gray for light theme
  
  return (
    <View style={[
      styles.container, 
      { backgroundColor } // Applied solid background color instead of image
    ]}>
      {/* Ensure status bar is in the right mode for the theme */}
      <StatusBar style={theme.isDark ? "light" : "dark"} />
      
      {/* Header */}
      <Header
        title="Landschafts-Galerie"
        subtitle="Deine Sammlung"
        onBackPress={handleBack}
      />
      
      {/* Content */}
      <Animated.View
        style={styles.content}
        entering={FadeIn.duration(400)}
      >
        {/* Tabs */}
        {renderTabs()}
        
        {/* Main content area */}
        <View style={{ flex: 1 }}>
          {landscapes.length > 0 ? (
            <ImageGrid
              landscapes={landscapes}
              isLoading={isLoading}
              onImagePress={handleImagePress}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            <EmptyState 
              activeTab={activeTab} 
              router={router} 
              colors={colors} 
            />
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