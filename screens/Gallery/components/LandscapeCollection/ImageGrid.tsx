import React, { forwardRef } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";
import { getCategoryName } from "@/screens/Gallery/utils/landscapes/data";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";
import styles from "./ImageGrid.styles";


// Extract to a separate component to properly use hooks
const LandscapeCard = React.memo(
  ({
    item,
    index,
    onImagePress,
    onToggleFavorite,
    currentImageId,
    shouldAnimate,
  }: {
    item: Landscape;
    index: number;
    onImagePress?: (landscape: Landscape, index: number) => void;
    onToggleFavorite?: (landscape: Landscape) => void;
    currentImageId?: string;
    shouldAnimate?: boolean;
  }) => {
    // Use key to ensure we don't re-render unnecessarily
    const cardKey = `${item.id}-${item.progress}-${item.isComplete}`;
    const theme = useTheme();
    const { colors } = theme;
    const { t } = useTranslation('gallery');

    // Prüfen, ob dieses Bild aktuell freigeschaltet wird
    const isCurrentProject = currentImageId === item.id && !item.isComplete;

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

    // Get badge color based on state - zurück zur ursprünglichen Logik ohne isCurrentProject
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

    // Get badge icon based on state - zurück zur ursprünglichen Logik ohne isCurrentProject
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
    };

    // Prüfen, ob es sich um das spezielle zweite Bild handelt
    const isSpecialPreunlockedImage = item.progress === 8;

    // Get badge text based on state - zurück zur ursprünglichen Logik ohne isCurrentProject
    const getBadgeText = () => {
      if (item.isComplete || item.isFavorite) {
        return ""; // No text for complete items or favorites
      }
      return isSpecialPreunlockedImage
        ? t('badges.remaining', { count: 1 })
        : t('badges.progress', { current: item.progress, total: 9 });
    };

    // Nur die ersten 8 Kacheln animieren (die sichtbar sind beim Öffnen)
    const shouldAnimateThisCard = shouldAnimate && index < 8;

    return (
      <Animated.View
        style={[styles.cardContainer, { backgroundColor: colors.card }]}
        entering={shouldAnimateThisCard ? SlideInRight.delay(index * 100).duration(400) : undefined}
      >
        <Animated.View style={cardAnimatedStyle}>
          <TouchableOpacity
            style={styles.imageContainer}
            activeOpacity={0.9}
            onPress={() => onImagePress && onImagePress(item, index)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            {/* Das tatsächliche Bild - wird nur angezeigt, wenn es vollständig freigeschaltet ist */}
            {item.isComplete ? (
              <Image source={item.previewSource} style={styles.image} />
            ) : (
              /* Für nicht freigeschaltete Bilder wird ein stilvoller Platzhalter angezeigt */
              <View
                style={[
                  styles.placeholderImage,
                  { backgroundColor: theme.isDark ? "#2D3748" : "#E2E8F0" },
                ]}
              >
                {/* Zeige verschwommenes Vorschaubild mit sehr niedriger Opazität als Teaser */}
                <Image
                  source={item.previewSource}
                  style={[
                    styles.blurredImage,
                    { opacity: Math.min(0.2 + item.progress * 0.07, 0.6) },
                  ]}
                  blurRadius={20}
                />

                {/* Zentrales Icon - für alle Kategorien gleich */}
                <View style={styles.placeholderIconContainer}>
                  <Feather
                    name="image"
                    size={32}
                    color={
                      theme.isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"
                    }
                  />

                  {/* Progressiver Text je nach Fortschritt */}
                  {item.progress > 0 && (
                    <Text
                      style={[
                        styles.placeholderText,
                        {
                          color: theme.isDark
                            ? "rgba(255,255,255,0.6)"
                            : "rgba(0,0,0,0.5)",
                          opacity: Math.min(0.6 + item.progress * 0.07, 1),
                        },
                      ]}
                    >
                      {isSpecialPreunlockedImage
                        ? t('placeholder.almostDone')
                        : t('placeholder.revealed', {
                            percent: Math.floor((item.progress / 9) * 100)
                          })}
                    </Text>
                  )}
                </View>
              </View>
            )}

            {/* Gradient overlay for better visibility of text elements */}
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.7)"]}
              style={styles.imageGradient}
            />

            {/* Aktiv-Badge links oben anzeigen, wenn dieses Bild aktuell freigeschaltet wird */}
            {isCurrentProject && (
              <View
                style={[
                  styles.currentProjectBadge,
                  { backgroundColor: colors.info },
                ]}
              >
                <Feather
                  name="target"
                  size={12}
                  color="#FFFFFF"
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.badgeText}>{t('badges.active')}</Text>
              </View>
            )}

            {/* Statusabzeichen mit Animation - wie vorher, rechts oben */}
            <Animated.View
              style={[
                styles.statusBadge,
                badgeAnimatedStyle,
                { backgroundColor: getBadgeColor() },
              ]}
            >
              <Feather
                name={getBadgeIcon() as any}
                size={12}
                color="#FFFFFF"
                style={
                  getBadgeText() ? styles.badgeIcon : styles.badgeIconNoText
                }
              />
              <Text style={styles.badgeText}>{getBadgeText()}</Text>
            </Animated.View>

            {/* Infobereich für Titel und Kategorie */}
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
  }
);

interface ImageGridProps {
  landscapes: Landscape[];
  isLoading?: boolean;
  onImagePress?: (landscape: Landscape, index: number) => void;
  onToggleFavorite?: (landscape: Landscape) => void;
  currentImageId?: string; // ID des aktuell freizuschaltenden Bildes
  shouldAnimate?: boolean; // Soll die Animation abgespielt werden?
  onScroll?: (event: any) => void; // Handler für Scroll-Events
}

const ImageGrid = forwardRef<FlatList, ImageGridProps>(({
  landscapes,
  isLoading = false,
  onImagePress,
  onToggleFavorite,
  currentImageId,
  shouldAnimate = true,
  onScroll,
}, ref) => {
  const theme = useTheme();
  const { colors } = theme;
  const { t } = useTranslation('gallery');

  // WICHTIG: getItemLayout ist bei numColumns schwierig korrekt zu implementieren
  // Wir verzichten darauf, da es zu Scroll-Problemen führt
  // Die Performance-Vorteile durch removeClippedSubviews und optimierte Render-Parameter reichen aus

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
          {t('emptyState.all.message')}
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
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <FlatList
        ref={ref}
        data={landscapes}
        renderItem={({ item, index }) => (
          <LandscapeCard
            item={item}
            index={index}
            onImagePress={onImagePress}
            onToggleFavorite={onToggleFavorite}
            currentImageId={currentImageId}
            shouldAnimate={shouldAnimate}
          />
        )}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={true}
        onScroll={onScroll}
        scrollEventThrottle={16}
        onScrollToIndexFailed={(info) => {
          // Fallback wenn scrollToIndex fehlschlägt
          const wait = new Promise(resolve => setTimeout(resolve, 50));
          wait.then(() => {
            if (ref && typeof ref !== 'function' && ref.current) {
              ref.current.scrollToIndex({ index: info.index, animated: false });
            }
          });
        }}
      />
    </Animated.View>
  );
});

export default ImageGrid;
