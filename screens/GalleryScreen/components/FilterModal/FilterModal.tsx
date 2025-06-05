// screens/GalleryScreen/components/FilterModal/FilterModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  BackHandler,
  Platform,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { spacing } from "@/utils/theme";
import { LANDSCAPE_CATEGORIES, LandscapeCategory } from "@/screens/GalleryScreen/utils/landscapes/data";
import CategoryGrid from "./components/CategoryGrid";
import InfoSection from "./components/InfoSection";
import styles from "./FilterModal.styles";

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategories: LandscapeCategory[];
  onApplyFilter: (categories: LandscapeCategory[]) => void;
  totalImages: number;
  filteredCount: number;
  allLandscapes?: any[]; // Für Preview-Berechnung
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedCategories,
  onApplyFilter,
  totalImages,
  filteredCount,
  allLandscapes = [],
}) => {
  const theme = useTheme();
  const { colors } = theme;
  const insets = useSafeAreaInsets();
  
  // Local state for temporary selections
  const [tempSelectedCategories, setTempSelectedCategories] = useState<LandscapeCategory[]>(selectedCategories);
  
  // Animation values
  const modalY = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  
  // Sync with prop changes
  useEffect(() => {
    setTempSelectedCategories(selectedCategories);
  }, [selectedCategories]);
  
  // Handle Android back button
  useEffect(() => {
    if (!visible) return;
    
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      handleClose();
      return true;
    });
    
    return () => backHandler.remove();
  }, [visible]);
  
  // Animation on mount/unmount
  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 300 });
      modalY.value = withSpring(0, { damping: 20 });
    }
  }, [visible]);
  
  // Handle close with animation
  const handleClose = () => {
    backdropOpacity.value = withTiming(0, { duration: 200 });
    modalY.value = withTiming(100, { duration: 200 }, () => {
      runOnJS(onClose)();
    });
  };
  
  // Handle category toggle
  const handleCategoryToggle = (category: LandscapeCategory) => {
    setTempSelectedCategories(prev => {
      const isSelected = prev.includes(category);
      if (isSelected) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };
  
  // Select all categories
  const handleSelectAll = () => {
    setTempSelectedCategories([]);
  };
  
  // Apply filters
  const handleApply = () => {
    onApplyFilter(tempSelectedCategories);
    handleClose();
  };
  
  // Reset filters
  const handleReset = () => {
    setTempSelectedCategories([]);
    onApplyFilter([]);
    handleClose();
  };
  
  // Animated styles
  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));
  
  const modalAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: modalY.value }],
  }));
  
  // Calculate if all categories are selected
  const allCategoriesSelected = tempSelectedCategories.length === 0 || 
    tempSelectedCategories.length === Object.keys(LANDSCAPE_CATEGORIES).length;
  
  // Get filtered count preview
  const getPreviewCount = () => {
    if (tempSelectedCategories.length === 0) return totalImages;
    
    // Wenn allLandscapes verfügbar ist, berechne die tatsächliche Anzahl
    if (allLandscapes && allLandscapes.length > 0) {
      return allLandscapes.filter((landscape: any) => 
        tempSelectedCategories.includes(landscape.category as LandscapeCategory)
      ).length;
    }
    
    // Fallback auf die übergebene filteredCount
    return filteredCount;
  };
  
  if (!visible) return null;
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <TouchableOpacity
          style={styles.backdropTouch}
          activeOpacity={1}
          onPress={handleClose}
        />
      </Animated.View>
      
      {/* Modal Content */}
      <Animated.View
        style={[
          styles.modalContainer,
          modalAnimatedStyle
        ]}
      >
        {Platform.OS === "ios" && (
          <BlurView
            intensity={95}
            tint={theme.isDark ? "dark" : "light"}
            style={[styles.blurBackground, { overflow: "hidden" }]}
          />
        )}
        
        <View style={[
          styles.modalContent,
          { backgroundColor: Platform.OS === "ios" 
            ? "transparent" 
            : theme.isDark ? colors.surface : colors.background 
          }
        ]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <TouchableOpacity
                style={[styles.closeButton, { backgroundColor: colors.surface }]}
                onPress={handleClose}
              >
                <Feather name="x" size={20} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Filter
            </Text>
            
            <View style={styles.headerRight}>
              {!allCategoriesSelected && (
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleReset}
                >
                  <Text style={[styles.resetText, { color: colors.primary }]}>
                    Zurücksetzen
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Filter Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
                  Nach Kategorien filtern
                </Text>
                <Text style={[styles.sectionSubtitle, { color: colors.textSecondary }]}>
                  {allCategoriesSelected 
                    ? "Alle Kategorien anzeigen" 
                    : `${tempSelectedCategories.length} ausgewählt`}
                </Text>
              </View>
              
              {/* All Categories Button */}
              <TouchableOpacity
                style={[
                  styles.allButton,
                  { 
                    borderColor: allCategoriesSelected ? colors.primary : colors.border,
                    backgroundColor: allCategoriesSelected ? colors.primary : "transparent",
                    borderWidth: 2, // Immer 2px Border
                  }
                ]}
                onPress={handleSelectAll}
              >
                <Text style={[
                  styles.allButtonText,
                  { color: allCategoriesSelected ? "#FFFFFF" : colors.textPrimary }
                ]}>
                  Alle Kategorien
                </Text>
              </TouchableOpacity>
              
              {/* Category Grid */}
              <CategoryGrid
                selectedCategories={tempSelectedCategories}
                onToggleCategory={handleCategoryToggle}
                allSelected={allCategoriesSelected}
              />
            </View>
            
            {/* Info Section */}
            <View style={[styles.section, styles.infoSectionContainer]}>
              <InfoSection />
            </View>
          </ScrollView>
          
          {/* Footer Actions */}
          <View style={[
            styles.footer,
            { 
              backgroundColor: Platform.OS === "ios" 
                ? "transparent" 
                : colors.background,
              borderTopColor: colors.border,
              paddingBottom: Math.max(insets.bottom, spacing.md)
            }
          ]}>
            <View style={styles.footerInfo}>
              <Text style={[styles.footerInfoText, { color: colors.textSecondary }]}>
                {allCategoriesSelected 
                  ? `${totalImages} Bilder werden angezeigt`
                  : `${getPreviewCount()} von ${totalImages} Bildern`}
              </Text>
            </View>
            
            <TouchableOpacity
              style={[styles.applyButton, { backgroundColor: colors.primary }]}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>
                Filter anwenden
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default FilterModal;