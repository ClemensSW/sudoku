import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList
} from "react-native";
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  Easing
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Landscape } from "@/utils/landscapes/types";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./ImageGrid.styles";

// Extract to a separate component to properly use hooks
const LandscapeCard = React.memo(({ 
  item, 
  index, 
  onImagePress, 
  onToggleFavorite 
}: { 
  item: Landscape; 
  index: number;
  onImagePress?: (landscape: Landscape) => void;
  onToggleFavorite?: (landscape: Landscape) => void;
}) => {
  // Use key to ensure we don't re-render unnecessarily
  const cardKey = `${item.id}-${item.progress}-${item.isComplete}`;
  const theme = useTheme();
  const { colors } = theme;
  
  // Animation-values
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const badgeScale = useSharedValue(1);
  
  // Reference for tracking current favorite state to prevent unnecessary animations
  const isFavoriteRef = React.useRef(item.isFavorite);
  
  // Animated styles
  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  // Heart animation for favorites button
  const heartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });
  
  // Badge animation
  const badgeAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: badgeScale.value }],
    };
  });

  // Touch handlers
  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  // Get category name based on category type
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
  
  // Get badge color based on state
  const getBadgeColor = () => {
    // Verwende error-Farbe (rot) für Favoriten
    if (item.isFavorite) {
      return colors.error;
    }
    // Sonst die bisherige Logik
    if (item.isComplete) {
      return colors.success;
    }
    return colors.primary;
  };
  
  // Get badge icon based on state
  const getBadgeIcon = () => {
    // Zeige Herz-Icon wenn es ein Favorit ist
    if (item.isFavorite) {
      return "heart";
    }
    // Sonst die bisherige Logik
    if (item.isComplete) {
      return "check-circle";
    }
    return item.progress === 0 ? "lock" : "clock";
  }
  
  // Get badge text based on state
  const getBadgeText = () => {
    if (item.isComplete || item.isFavorite) {
      return ""; // No text for complete items or favorites
    }
    return `${item.progress}/9`;
  }

  return (
    <Animated.View
      style={[styles.cardContainer, { backgroundColor: colors.card }]}
      entering={SlideInRight.delay(index * 100).springify().damping(15)}
    >
      <Animated.View style={cardAnimatedStyle}>
        <TouchableOpacity
          style={styles.imageContainer}
          activeOpacity={0.9}
          onPress={() => onImagePress && onImagePress(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Image source={item.previewSource} style={styles.image} />

          {/* Gradient overlay for better visibility of text elements */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />

          {/* Simple darken overlay for incomplete images */}
          {!item.isComplete && (
            <View style={styles.overlayContainer} />
          )}

          {/* Modernized status badge */}
          <Animated.View
            style={[
              styles.statusBadge,
              badgeAnimatedStyle,
              { backgroundColor: getBadgeColor() }
            ]}
          >
            <Feather 
              name={getBadgeIcon() as any} 
              size={12} 
              color="#FFFFFF"
              style={getBadgeText() ? styles.badgeIcon : styles.badgeIconNoText}
              
            />
            <Text style={styles.badgeText}>{getBadgeText()}</Text>
          </Animated.View>

          {/* Enhanced info area with better readability */}
          <View style={styles.infoContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.category}>
              {getCategoryName(item.category)}
            </Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
});

interface ImageGridProps {
  landscapes: Landscape[];
  isLoading?: boolean;
  onImagePress?: (landscape: Landscape) => void;
  onToggleFavorite?: (landscape: Landscape) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({
  landscapes,
  isLoading = false,
  onImagePress,
  onToggleFavorite,
}) => {
  const theme = useTheme();
  const { colors } = theme;

  // No content available
  if (!isLoading && landscapes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Feather
          name="image"
          size={48}
          color={colors.textSecondary}
          style={{ opacity: 0.5 }}
        />
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Noch keine Landschaften verfügbar. Löse Sudokus, um wunderschöne Landschaftsbilder freizuschalten!
        </Text>
      </View>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Render grid with FlatList for better performance
  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <FlatList
        data={landscapes}
        renderItem={({item, index}) => (
          <LandscapeCard 
            item={item} 
            index={index} 
            onImagePress={onImagePress}
            onToggleFavorite={onToggleFavorite}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={4}
        maxToRenderPerBatch={6}
        windowSize={5}
      />
    </Animated.View>
  );
};

export default React.memo(ImageGrid);