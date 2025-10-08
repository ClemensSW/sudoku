import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  StatusBar,
  Platform,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
  SlideInUp,
  SlideOutDown,
  Easing,
  SharedValue,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur"; // You may need to install this package
import styles, { tagColors } from "./ImageDetailModal.styles";
import { getLandscapeName, getLandscapeDescription, getCategoryName } from "@/screens/Gallery/utils/landscapes/data";
import { useTranslation } from "react-i18next";
import { useSupporter } from "@/modules/subscriptions/hooks/useSupporter";
import { useImageUnlock } from "@/modules/subscriptions/hooks/useImageUnlock";
import { unlockImageAsSupporter } from "@/modules/gallery/supporterUnlocks";
import UnlockConfirmationDialog from "../UnlockConfirmationDialog";
import SupporterBadge from "../SupporterBadge";
import * as Haptics from "expo-haptics";

interface ImageDetailModalProps {
  visible: boolean;
  landscape: Landscape | null;
  onClose: () => void;
  onToggleFavorite?: (landscape: Landscape) => void;
  onSelectAsProject?: (landscape: Landscape) => void;
  currentImageId?: string; // ID des aktuell freizuschaltenden Bildes
  onImageUnlocked?: () => void; // Callback nach erfolgreichem Unlock
}

// Tag component for reusability
interface TagProps {
  icon: string;
  text: string;
  type: keyof typeof tagColors;
}

const Tag: React.FC<TagProps> = ({ icon, text, type }) => {
  const colors = tagColors[type];

  return (
    <View style={[styles.tag, { backgroundColor: colors.background }]}>
      <Feather
        name={icon as any}
        size={14}
        color={colors.icon}
        style={styles.tagIcon}
      />
      <Text style={[styles.tagText, { color: colors.text }]}>{text}</Text>
    </View>
  );
};

const ImageDetailModal: React.FC<ImageDetailModalProps> = ({
  visible,
  landscape,
  onClose,
  onToggleFavorite,
  onSelectAsProject,
  currentImageId,
  onImageUnlocked,
}) => {
  const theme = useTheme();
  const { colors: themeColors } = theme;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('gallery');

  // States
  const [controlsVisible, setControlsVisible] = useState(true);
  const [statusBarHidden, setStatusBarHidden] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // Supporter hooks
  const { isSupporter } = useSupporter();
  const { canUnlock, remainingUnlocks, refresh: refreshQuota } = useImageUnlock();

  // Animation values
  const heartScale = useSharedValue(1);
  const headerOpacity = useSharedValue(1);
  const footerOpacity = useSharedValue(1);
  const imageScale = useSharedValue(1);

  // Prüfen, ob dieses Bild aktuell freigeschaltet wird
  const isCurrentProject =
    landscape && currentImageId === landscape.id && !landscape.isComplete;

  // Hide status bar for immersive view
  useEffect(() => {
    if (visible) {
      setStatusBarHidden(true);
    } else {
      setStatusBarHidden(true);
    }

    // WICHTIG: Cleanup-Funktion, die beim Unmount aufgerufen wird
    return () => {
      setStatusBarHidden(true);
      // Explizit die StatusBar wieder verstecken für die Hauptapp
      StatusBar.setHidden(true);
    };
  }, [visible]);

  // Format date
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "";

    const date = new Date(dateString);
    return date.toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
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

  // Handle für die Projektauswahl
  const handleSelectAsProject = () => {
    if (landscape && onSelectAsProject && !landscape.isComplete) {
      onSelectAsProject(landscape);
    }
  };

  // Handle supporter unlock
  const handleSupporterUnlock = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowUnlockDialog(true);
  };

  const confirmSupporterUnlock = async () => {
    if (!landscape || !canUnlock) return;

    setUnlocking(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const result = await unlockImageAsSupporter(landscape.id);

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowUnlockDialog(false);
        await refreshQuota();

        // Trigger landscape refresh
        if (onImageUnlocked) {
          await onImageUnlocked();
        }

        // Keep modal open to show unlocked image
        // onClose();
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        alert(result.error || 'Failed to unlock image');
      }
    } catch (error) {
      console.error('Error unlocking image:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert('Failed to unlock image');
    } finally {
      setUnlocking(false);
    }
  };

  // Check if supporter can unlock this specific image
  const canUnlockThisImage = isSupporter && canUnlock && landscape && !landscape.isComplete;

  // Toggle controls visibility on image tap
  const toggleControls = () => {
    const newVisibility = !controlsVisible;
    setControlsVisible(newVisibility);

    // Animate header and footer
    headerOpacity.value = withTiming(newVisibility ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    footerOpacity.value = withTiming(newVisibility ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  };

  // Add zoom animation when opening image
  useEffect(() => {
    if (visible) {
      // Start slightly zoomed out and zoom in
      imageScale.value = 0.92;
      imageScale.value = withTiming(1, {
        duration: 400,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });

      // Ensure controls are visible initially
      setControlsVisible(true);
      headerOpacity.value = 1;
      footerOpacity.value = 1;
    }
  }, [visible]);

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

  // Animated styles
  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const headerAnimatedStyle = useAnimatedStyle(() => {
    const isHidden = headerOpacity.value === 0;
    return {
      opacity: headerOpacity.value,
      transform: [
        {
          translateY: withTiming(isHidden ? -50 : 0, {
            duration: 300,
          }),
        },
      ],
    };
  });

  const footerAnimatedStyle = useAnimatedStyle(() => {
    const isHidden = footerOpacity.value === 0;
    return {
      opacity: footerOpacity.value,
      transform: [
        {
          translateY: withTiming(isHidden ? 50 : 0, {
            duration: 300,
          }),
        },
      ],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: imageScale.value }],
  }));

  // Don't show content if not visible or no landscape
  if (!visible || !landscape) return null;

  // Check if it's the special pre-unlocked image
  const isSpecialPreunlockedImage = landscape.progress === 8;

  // Render complete image view
  const renderCompleteImage = () => (
    <Animated.View style={[styles.imageContainer, imageAnimatedStyle]}>
      <Image source={landscape.fullSource} style={styles.image} />
    </Animated.View>
  );

  // Render placeholder for incomplete image
  const renderIncompletePlaceholder = () => (
    <View style={styles.placeholderContainer}>
      {/* Blurred background preview */}
      <Image
        source={landscape.fullSource}
        style={[
          styles.blurredBackground,
          { opacity: Math.min(0.2 + landscape.progress * 0.08, 0.7) },
        ]}
        blurRadius={25}
      />

      {/* Grid overlay showing segments */}
      <View style={styles.gridContainer}>
        {landscape.segments.map((segment, index) => (
          <View
            key={`segment-${index}`}
            style={[
              styles.gridSegment,
              !segment.isUnlocked && styles.lockedSegment,
            ]}
          >
            {!segment.isUnlocked && (
              <Feather name="lock" size={20} color="rgba(255,255,255,0.5)" />
            )}
          </View>
        ))}
      </View>

      {/* Progress text below grid */}
      <Text style={styles.progressText}>
        {isSpecialPreunlockedImage
          ? t('detailModal.almostDoneSegment')
          : t('placeholder.revealed', {
              percent: Math.floor((landscape.progress / 9) * 100)
            })}
      </Text>

      {/* Progress bar */}
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(landscape.progress / 9) * 100}%`,
              backgroundColor: themeColors.primary,
            },
          ]}
        />
      </View>
    </View>
  );

  // Render header with controls
  const renderHeader = () => (
    <Animated.View
      style={[
        styles.headerContainer,
        { paddingTop: insets.top },
        headerAnimatedStyle,
      ]}
    >
      {/* Backdrop effect - platform specific */}
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={60}
          tint="dark"
          style={styles.headerBlur}
          pointerEvents="none"
        />
      ) : (
        <LinearGradient
          colors={["rgba(0,0,0,0.8)", "rgba(0,0,0,0.4)", "transparent"]}
          style={styles.headerGradient}
          pointerEvents="none"
        />
      )}

      {/* Header content */}
      <View style={styles.headerContent}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.controlButton}
          onPress={onClose}
          activeOpacity={0.8}
        >
          <Feather name="arrow-left" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {getLandscapeName(landscape.id)}
          </Text>
        </View>

        {/* Favorites button (only for complete images) */}
        {landscape.isComplete ? (
          <Animated.View style={heartAnimatedStyle}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleToggleFavorite}
              activeOpacity={0.8}
            >
              <Feather
                name={landscape.isFavorite ? "heart" : "heart"}
                size={22}
                color={landscape.isFavorite ? "#FF3868" : "#FFFFFF"}
              />
            </TouchableOpacity>
          </Animated.View>
        ) : (
          // Placeholder to maintain layout
          <View style={{ width: 40 }} />
        )}
      </View>
    </Animated.View>
  );

  // Render footer with metadata
  const renderFooter = () => (
    <Animated.View
      style={[
        styles.footerContainer,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        footerAnimatedStyle,
      ]}
    >
      {/* Backdrop effect - platform specific */}
      {Platform.OS === "ios" ? (
        <BlurView
          intensity={60}
          tint="dark"
          style={styles.footerBlur}
          pointerEvents="none"
        />
      ) : (
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.6)", "rgba(0,0,0,0.9)"]}
          style={styles.footerGradient}
          pointerEvents="none"
        />
      )}

      {/* Footer content */}
      <View style={styles.footerContent}>
        {/* description */}
        <Text style={styles.description}>{getLandscapeDescription(landscape.id)}</Text>

        {/* Tags */}
        <View style={styles.tagsContainer}>
          {/* Favorite tag */}
          {landscape.isFavorite && (
            <Tag icon="heart" text={t('detailModal.favoriteTag')} type="favorite" />
          )}

          {/* Date tag */}
          {landscape.isComplete && landscape.completedAt && (
            <Tag
              icon="calendar"
              text={formatDate(landscape.completedAt)}
              type="date"
            />
          )}

          {/* Current Project tag - für das aktuelle freizuschaltende Bild */}
          {isCurrentProject && (
            <Tag
              icon="target"
              text={t('detailModal.currentProjectTag')}
              type="currentProject"
            />
          )}
        </View>

        {/* Supporter Badge - show if supporter with remaining unlocks */}
        {isSupporter && !landscape.isComplete && (
          <View style={{ marginTop: 12 }}>
            <SupporterBadge remainingUnlocks={remainingUnlocks} />
          </View>
        )}

        {/* Action Buttons for incomplete images */}
        {landscape && !landscape.isComplete && !isCurrentProject && (
          <View style={styles.footerActionButton}>
            {/* Supporter Unlock Button - priority if available */}
            {canUnlockThisImage && (
              <TouchableOpacity
                style={[
                  styles.selectProjectButton,
                  {
                    backgroundColor: '#9333EA',
                    marginBottom: 8,
                  },
                ]}
                onPress={handleSupporterUnlock}
                activeOpacity={0.8}
              >
                <Text style={styles.selectButtonText}>
                  {t('detailModal.supporterUnlockButton')}
                </Text>
              </TouchableOpacity>
            )}

            {/* Regular segment-based unlock button */}
            <TouchableOpacity
              style={[
                styles.selectProjectButton,
                { backgroundColor: themeColors.primary },
              ]}
              onPress={handleSelectAsProject}
              activeOpacity={0.8}
            >
              <Feather
                name="target"
                size={16}
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.selectButtonText}>
                {t('detailModal.unlockButton')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <Animated.View
      style={styles.overlay}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
    >
      {/* Update status bar */}
      <StatusBar hidden={statusBarHidden} />

      {/* Main container */}
      <View style={styles.container}>
        {/* Image area - Touchable to toggle controls */}
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1 }}
          onPress={toggleControls}
        >
          {landscape.isComplete
            ? renderCompleteImage()
            : renderIncompletePlaceholder()}
        </TouchableOpacity>

        {/* Header with controls */}
        {renderHeader()}

        {/* Footer with metadata */}
        {renderFooter()}
      </View>

      {/* Unlock Confirmation Dialog */}
      {landscape && (
        <UnlockConfirmationDialog
          visible={showUnlockDialog}
          imageName={getLandscapeName(landscape.id)}
          remainingUnlocks={remainingUnlocks}
          onConfirm={confirmSupporterUnlock}
          onCancel={() => setShowUnlockDialog(false)}
          loading={unlocking}
        />
      )}
    </Animated.View>
  );
};

export default ImageDetailModal;
