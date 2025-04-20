import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Landscape, LandscapeFilter } from "@/utils/landscapes/types";
import { useLandscapes } from "@/hooks/useLandscapes";
import { ImageGrid, ImageDetailModal } from "@/components/LandscapeCollection";
import Header from "@/components/Header/Header";
import Background from "@/components/Background/Background";
import styles from "./GalleryScreen.styles";

const GalleryScreen: React.FC = () => {
  const theme = useTheme();
  const { colors } = theme;
  const router = useRouter();
  
  // States
  const [activeTab, setActiveTab] = useState<LandscapeFilter>("all");
  const [selectedLandscape, setSelectedLandscape] = useState<Landscape | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  // Verwende den useLandscapes Hook
  const { 
    landscapes, 
    isLoading, 
    toggleFavorite, 
    changeFilter,
    reload
  } = useLandscapes(activeTab);
  
  // Ändere den Filter, wenn der Tab geändert wird
  useEffect(() => {
    changeFilter(activeTab);
  }, [activeTab, changeFilter]);
  
  // Tab-Daten
  const tabs: Array<{id: LandscapeFilter, label: string}> = [
    { id: "all", label: "Alle" },
    { id: "inProgress", label: "In Arbeit" },
    { id: "completed", label: "Komplett" },
    { id: "favorites", label: "Favoriten" }
  ];
  
  // Handler für Bild-Tap
  const handleImagePress = (landscape: Landscape) => {
    setSelectedLandscape(landscape);
    setDetailModalVisible(true);
  };
  
  // Handler für Favoriten-Toggle
  const handleToggleFavorite = async (landscape: Landscape) => {
    await toggleFavorite(landscape.id);
    
    // Wenn wir uns im Detail-Modal befinden, aktualisiere das ausgewählte Landschaftsbild
    if (selectedLandscape && selectedLandscape.id === landscape.id) {
      // Setze den favorisierten Status im momentan angezeigten Landscape
      setSelectedLandscape({
        ...selectedLandscape,
        isFavorite: !selectedLandscape.isFavorite
      });
    }
  };
  
  // Navigation zurück
  const handleBack = () => {
    router.back();
  };
  
  // Detail-Modal schließen
  const handleCloseDetailModal = () => {
    setDetailModalVisible(false);
    
    // Verzögerung zum Neuladen der Daten nach dem Schließen
    setTimeout(() => {
      reload();
    }, 300);
  };
  
  // Tab wechseln
  const handleTabPress = (tabId: LandscapeFilter) => {
    setActiveTab(tabId);
  };
  
  // Rendere die Tab-Buttons
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
  
  // Leere Zustände für verschiedene Filter
  const renderEmptyState = () => {
    // Texte für die verschiedenen Filterzustände
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
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hintergrund mit subtiler Tönungsfarbe */}
      <Background variant="blue" />
      
      {/* Header */}
      <Header
        title="Landschafts-Galerie"
        onBackPress={handleBack}
      />
      
      {/* Content */}
      <Animated.View
        style={styles.content}
        entering={FadeIn.duration(400)}
      >
        {/* Tabs */}
        {renderTabs()}
        
        {/* Landschafts-Grid */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {landscapes.length > 0 ? (
            <ImageGrid
              landscapes={landscapes}
              isLoading={isLoading}
              onImagePress={handleImagePress}
              onToggleFavorite={handleToggleFavorite}
            />
          ) : (
            renderEmptyState()
          )}
        </ScrollView>
      </Animated.View>
      
      {/* Detail-Modal */}
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