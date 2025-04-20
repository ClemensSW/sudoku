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
import { Landscape, LandscapeSegment } from "@/utils/landscapes/types";
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
  
  // Animation-Werte
  const heartScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  
  // Kategorien-Mapping
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
  
  // Formatiere Datum
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };
  
  // Handle für Favoriten-Toggle
  const handleToggleFavorite = () => {
    if (!landscape || !landscape.isComplete || !onToggleFavorite) return;
    
    // Herz-Animation
    heartScale.value = withSequence(
      withTiming(1.3, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
    
    // Callback aufrufen
    onToggleFavorite(landscape);
  };
  
  // Back-Handler
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
  
  // Effekt bei Sichtbarkeitsänderung
  useEffect(() => {
    if (visible) {
      contentOpacity.value = withTiming(1, { duration: 400 });
    } else {
      contentOpacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);
  
  // Animierte Styles
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }]
  }));
  
  const contentAnimatedStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value
  }));
  
  // Rendere das Grid für unvollständige Bilder
  const renderSegmentGrid = (segments: LandscapeSegment[]) => {
    return (
      <View style={styles.gridOverlay}>
        {segments.map((segment, index) => (
          <View
            key={`segment-${index}`}
            style={[
              styles.segment,
              segment.isUnlocked ? styles.unlockedSegment : styles.lockedSegment
            ]}
          >
            {!segment.isUnlocked && (
              <Feather 
                name="lock" 
                size={16} 
                color="rgba(255,255,255,0.5)" 
              />
            )}
          </View>
        ))}
      </View>
    );
  };
  
  // Kein Inhalt anzeigen, wenn nicht sichtbar oder kein Landschaftsbild
  if (!visible || !landscape) return null;
  
  return (
    <Animated.View 
      style={styles.overlay}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      {/* Hintergrund */}
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
        {/* Header mit Gradient für bessere Lesbarkeit */}
        <LinearGradient
          colors={["rgba(0,0,0,0.7)", "transparent"]}
          style={styles.headerGradient}
        />
        
        <Animated.View 
          style={[styles.header, contentAnimatedStyle]}
        >
          {/* Schließen-Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Feather name="x" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          {/* Favoriten-Button (nur für komplette Bilder) */}
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
        
        {/* Hauptbildbereich */}
        <View style={styles.imageContainer}>
          <Image 
            source={landscape.fullSource} 
            style={styles.image}
          />
          
          {/* Overlay für unvollständige Bilder */}
          {!landscape.isComplete && (
            <View style={styles.progressOverlay}>
              {renderSegmentGrid(landscape.segments)}
            </View>
          )}
        </View>
        
        {/* Info-Panel unten mit Gradient für bessere Lesbarkeit */}
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
            
            {/* Metadaten */}
            <View style={styles.metaContainer}>
              {/* Kategorie */}
              <View style={styles.metaItem}>
                <Feather name="image" size={14} color="#FFFFFF" />
                <Text style={styles.metaText}>
                  {getCategoryName(landscape.category)}
                </Text>
              </View>
              
              {/* Fortschritt oder Status */}
              <View style={styles.metaItem}>
                {landscape.isComplete ? (
                  <>
                    <Feather name="check-circle" size={14} color="#FFFFFF" />
                    <Text style={styles.metaText}>Komplett</Text>
                  </>
                ) : (
                  <>
                    <Feather name="unlock" size={14} color="#FFFFFF" />
                    <Text style={styles.progressText}>
                      {landscape.progress}/9
                    </Text>
                  </>
                )}
              </View>
              
              {/* Nur bei Favoriten anzeigen */}
              {landscape.isFavorite && (
                <View style={styles.metaItem}>
                  <Feather name="heart" size={14} color="#FFFFFF" />
                  <Text style={styles.metaText}>Favorit</Text>
                </View>
              )}
            </View>
            
            {/* Freischaltungsdatum für komplette Bilder */}
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