import React, { useEffect } from "react";
import { View, Text, Image, TouchableOpacity, BackHandler } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Landscape } from "@/utils/landscapes/types";
import styles from "./ImageDetailModal.styles";

interface ImageDetailModalProps {
  visible: boolean;
  landscape: Landscape | null;
  onClose: () => void;
  onToggleFavorite?: (landscape: Landscape) => void;
}

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  visible,
  landscape,
  onClose,
  onToggleFavorite
}) => {
  const theme = useTheme();
  const { colors } = theme;
  
  // Animation values
  const heartScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  
  // Category mapping
  const getCategoryName = (category: string): string => {
    const categories: Record<string, string> = {
      mountains: "Berge",
      forests: "Wälder",
      lakes: "Seen",
      beaches: "Strände",
      winter: "Winter",
      sunsets: "Sonnenuntergänge",
    };
    return categories[category] || category;
  };
  
  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  
  // Handle for favorites toggle
  const handleToggleFavorite = () => {
    if (!landscape || !landscape.isComplete || !onToggleFavorite) return;
    
    // Heart animation
    heartScale.value = withSequence(
      withTiming(1.3, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
    
    // Call callback
    onToggleFavorite(landscape);
  };
  
  // Back handler
  useEffect(() => {
    if (!visible) return;
    
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onClose();
        return true;
      }
    );
    
    return () => backHandler.remove();
  }, [visible, onClose]);
  
  // Effect when visibility changes
  useEffect(() => {
    if (visible) {
      contentOpacity.value = withTiming(1, { duration: 400 });
    } else {
      contentOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);
  
  // Animated styles
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }]
  }));
  
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value
  }));
  
  // Don't show content if not visible or no landscape
  if (!visible || !landscape) return null;
  
  // Prüfen, ob es sich um das spezielle zweite Bild handelt
  const isSpecialPreunlockedImage = landscape.id === "lakes-1" && landscape.progress === 8;
  
  return (
    <Animated.View 
      style={styles.overlay}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      {/* Background */}
      <Animated.View 
        style={[
          styles.backdrop,
          { backgroundColor: colors.backdropColor }
        ]}
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(200)}
      />
      
      <Animated.View
        style={styles.modalContainer}
        entering={SlideInUp.springify().damping(15)}
        exiting={SlideOutDown.duration(200)}
      >
        {/* Header with gradient for better readability */}
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent"]}
          style={styles.headerGradient}
        />
        
        <Animated.View 
          style={[styles.header, contentAnimatedStyle]}
        >
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          {/* Favorites button (only for complete images) */}
          {landscape.isComplete && (
            <Animated.View style={heartAnimatedStyle}>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleToggleFavorite}
              >
                <Feather
                  name={landscape.isFavorite ? "heart" : "heart"}
                  size={24}
                  color={landscape.isFavorite ? colors.error : "#FFFFFF"}
                />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
        
        {/* Main image area - mit angepasster Logik für unvollständig freigeschaltete Bilder */}
        <View style={styles.imageContainer}>
          {landscape.isComplete ? (
            /* Vollständig freigeschaltetes Bild normal anzeigen */
            <Image 
              source={landscape.fullSource} 
              style={styles.image}
            />
          ) : (
            /* Für unvollständig freigeschaltete Bilder einen stilisierten Platzhalter anzeigen */
            <View style={styles.placeholderContainer}>
              {/* Verschwommenes Hintergrundbild mit progressiver Opazität */}
              <Image 
                source={landscape.fullSource} 
                style={[
                  styles.blurredImage, 
                  { opacity: Math.min(0.2 + (landscape.progress * 0.07), 0.6) }
                ]} 
                blurRadius={20}
              />
              
              {/* Fortschrittsanzeige in der Mitte */}
              <View style={styles.placeholderContent}>
                <Feather 
                  name="image" 
                  size={48} 
                  color="rgba(255, 255, 255, 0.6)" 
                />
                
                <Text style={styles.progressText}>
                  {isSpecialPreunlockedImage ? (
                    "Fast fertig! Nur noch 1 Segment"
                  ) : (
                    `${Math.floor(landscape.progress/9 * 100)}% enthüllt`
                  )}
                </Text>
                
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBackground}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${(landscape.progress/9) * 100}%` }
                      ]}
                    />
                  </View>
                </View>
                
                <Text style={styles.progressHint}>
                  {isSpecialPreunlockedImage ? (
                    "Löse ein Sudoku, um das letzte Segment freizuschalten"
                  ) : (
                    "Löse weitere Sudokus, um das Bild freizuschalten"
                  )}
                </Text>
              </View>
            </View>
          )}
        </View>
        
        {/* Info panel at bottom with gradient for better readability */}
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.8)"]}
          style={styles.infoGradient}
        />
        
        <Animated.View 
          style={[styles.infoPanel, contentAnimatedStyle]}
        >
          <View style={styles.infoContent}>
            <Text style={styles.title}>{landscape.name}</Text>
            <Text style={styles.description}>{landscape.description}</Text>
            
            {/* Metadata */}
            <View style={styles.metaContainer}>
              {/* Category */}
              <View style={styles.metaItem}>
                <Feather name="image" size={14} color="#FFFFFF" />
                <Text style={styles.metaText}>
                  {getCategoryName(landscape.category)}
                </Text>
              </View>
              
              {/* Progress or status */}
              <View style={styles.metaItem}>
                {landscape.isComplete ? (
                  <>
                    <Feather name="check-circle" size={14} color="#FFFFFF" />
                    <Text style={styles.metaText}>Komplett</Text>
                  </>
                ) : isSpecialPreunlockedImage ? (
                  <>
                    <Feather name="unlock" size={14} color="#FFFFFF" />
                    {/* Angepasster Text für das spezielle Bild */}
                    <Text style={styles.metaProgressText}>
                      Noch 1
                    </Text>
                  </>
                ) : (
                  <>
                    <Feather name="unlock" size={14} color="#FFFFFF" />
                    {/* Hier progressText zu metaProgressText geändert */}
                    <Text style={styles.metaProgressText}>
                      {landscape.progress}/9
                    </Text>
                  </>
                )}
              </View>
              
              {/* Only show for favorites */}
              {landscape.isFavorite && (
                <View style={styles.metaItem}>
                  <Feather name="heart" size={14} color="#FFFFFF" />
                  <Text style={styles.metaText}>Favorit</Text>
                </View>
              )}
            </View>
            
            {/* Unlock date for complete images */}
            {landscape.isComplete && landscape.completedAt && (
              <Text style={styles.completionDate}>
                Freigeschaltet am {formatDate(landscape.completedAt)}
              </Text>
            )}
          </View>
        </Animated.View>
      </Animated.View>
    </Animated.View>
  );
};

export default ImageDetailModal;