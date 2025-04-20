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
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Landscape } from "@/utils/landscapes/types";
import { useTheme } from "@/utils/theme/ThemeProvider";
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
  const theme = useTheme();
  const { colors } = theme;
  
  // Animation-values (now correctly at the top level)
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);

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

  // Touch handlers
  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  // Favorites toggle with animation
  const handleToggleFavorite = () => {
    heartScale.value = withSpring(1.2, { damping: 5 });
    setTimeout(() => {
      heartScale.value = withSpring(1, { damping: 12 });
      if (onToggleFavorite) {
        onToggleFavorite(item);
      }
    }, 200);
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

  return (
    <Animated.View
      style={[styles.cardContainer, { backgroundColor: colors.surface }]}
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

          {/* Overlay for images in progress */}
          {!item.isComplete && (
            <View style={styles.progressOverlay}>
              {/* Here we could also show a grid with already unlocked segments */}
            </View>
          )}

          {/* Favorites button (only for complete images) */}
          {item.isComplete && (
            <Animated.View
              style={heartAnimatedStyle}
            >
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleToggleFavorite}
              >
                <Feather
                  name={item.isFavorite ? "heart" : "heart"}
                  size={22}
                  color={item.isFavorite ? colors.error : "rgba(255,255,255,0.8)"}
                />
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Progress badge */}
          <View style={styles.badgeContainer}>
            {!item.isComplete ? (
              <View style={styles.progressBadge}>
                <Feather name="unlock" size={12} color="#FFFFFF" />
                <Text style={styles.progressText}>
                  {item.progress}/9
                </Text>
              </View>
            ) : item.isFavorite ? (
              <View style={[
                styles.progressBadge,
                { backgroundColor: "rgba(255, 50, 50, 0.8)" }
              ]}>
                <Feather name="heart" size={12} color="#FFFFFF" />
                <Text style={styles.progressText}>Favorit</Text>
              </View>
            ) : (
              <View style={[
                styles.progressBadge,
                { backgroundColor: "rgba(0, 200, 100, 0.8)" }
              ]}>
                <Feather name="check" size={12} color="#FFFFFF" />
                <Text style={styles.progressText}>Komplett</Text>
              </View>
            )}
          </View>

          {/* Info area */}
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

export default ImageGrid;