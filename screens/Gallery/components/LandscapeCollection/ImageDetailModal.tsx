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
import { useNavigation as useReactNavigation } from "@react-navigation/native";

interface ImageDetailModalProps {
  visible: boolean;
  landscape: Landscape | null;
  onClose: () => void;
  onToggleFavorite?: (landscape: Landscape) => void;
  onSelectAsProject?: (landscape: Landscape) => void;
  currentImageId?: string; // ID des aktuell freizuschaltenden Bildes
  onImageUnlocked?: () => void; // Callback nach erfolgreichem Unlock
  onOpenSupportShop?: () => void; // Callback to open Support Shop
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
  onOpenSupportShop,
}) => {
  const theme = useTheme();
  const { colors: themeColors } = theme;
  const insets = useSafeAreaInsets();
  const { t } = useTranslation('gallery');
  const navigation = useReactNavigation();

  // States
  const [controlsVisible, setControlsVisible] = useState(true);
  const [statusBarHidden, setStatusBarHidden] = useState(false);
  const [showUnlockDialog, setShowUnlockDialog] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [fullscreenBannerDismissed, setFullscreenBannerDismissed] = useState(false);

  // Supporter hooks
  const { isSupporter, status: supporterStatus } = useSupporter();
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

        // Close modal after short delay to show unlocked image
        setTimeout(() => {
          onClose();
        }, 1500);
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

  // Determine if fullscreen banner should be shown
  const shouldShowFullscreenBanner =
    landscape &&
    !landscape.isComplete &&
    !fullscreenBannerDismissed &&
    (!isSupporter || !canUnlock);

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

      // Reset banner dismissed state when opening modal
      setFullscreenBannerDismissed(false);
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

  // Get banner content based on supporter status
  const getFullscreenBannerContent = () => {
    console.log('[ImageDetailModal] Banner Content Debug:', {
      isSupporter,
      supportType: supporterStatus?.supportType,
      isPremiumSubscriber: supporterStatus?.isPremiumSubscriber,
      fullStatus: supporterStatus,
    });

    if (!isSupporter) {
      // Non-supporter
      return {
        title: t('fullscreenBanner.nonSupporter.title'),
        subtitle: t('fullscreenBanner.nonSupporter.subtitle'),
      };
    } else if (supporterStatus?.supportType === 'one-time') {
      // One-time supporter without quota
      return {
        title: t('fullscreenBanner.oneTimeNoQuota.title'),
        subtitle: t('fullscreenBanner.oneTimeNoQuota.subtitle'),
      };
    } else {
      // Subscription supporter without quota
      return {
        title: t('fullscreenBanner.subscriptionNoQuota.title'),
        subtitle: t('fullscreenBanner.subscriptionNoQuota.subtitle'),
      };
    }
  };

  // Render fullscreen banner
  const renderFullscreenBanner = () => {
    const bannerContent = getFullscreenBannerContent();

    // Premium gold color
    const premiumColor = '#D4AF37';

    return (
      <TouchableOpacity
        style={{
          marginTop: 12,
          backgroundColor: theme.isDark
            ? "rgba(212, 175, 55, 0.12)"
            : "rgba(212, 175, 55, 0.08)",
          borderColor: theme.isDark
            ? "rgba(212, 175, 55, 0.3)"
            : "rgba(212, 175, 55, 0.25)",
          borderWidth: 1,
          borderRadius: 12,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          if (onOpenSupportShop) {
            onClose();
            setTimeout(() => {
              onOpenSupportShop();
            }, 300);
          }
        }}
        activeOpacity={0.8}
      >
        {/* Icon */}
        <View style={{ marginRight: 12 }}>
          <Feather name="award" size={20} color={premiumColor} />
        </View>

        {/* Text content */}
        <View style={{ flex: 1 }}>
          <Text style={{ color: premiumColor, fontSize: 15, fontWeight: '600' }}>
            {bannerContent.title}
          </Text>
          <Text style={{ color: themeColors.textSecondary, fontSize: 13, marginTop: 2 }}>
            {bannerContent.subtitle}
          </Text>
        </View>

        {/* Dismiss button */}
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setFullscreenBannerDismissed(true);
          }}
          style={{ padding: 4, marginLeft: 8 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="x" size={18} color={themeColors.textSecondary} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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

        {/* Fullscreen Banner - show for non-supporters or supporters without quota */}
        {shouldShowFullscreenBanner && renderFullscreenBanner()}

        {/* Supporter Badge - show if supporter with remaining unlocks */}
        {isSupporter && !landscape.isComplete && canUnlock && (
          <View style={{ marginTop: 12 }}>
            <SupporterBadge remainingUnlocks={remainingUnlocks} />
          </View>
        )}

        {/* Action Buttons for incomplete images */}
        {landscape && !landscape.isComplete && !isCurrentProject && (
          <View style={styles.footerActionButton}>
            {/* Supporter Unlock Button - priority if available */}
            {canUnlockThisImage && (
              <View
                style={{
                  marginBottom: 8,
                  shadowColor: '#D4AF37',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <LinearGradient
                  colors={['#E5C158', '#D4AF37', '#C19A2E']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 12,
                    overflow: 'hidden',
                  }}
                >
                  <TouchableOpacity
                    style={[
                      styles.selectProjectButton,
                      {
                        backgroundColor: 'transparent',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                    ]}
                    onPress={handleSupporterUnlock}
                    activeOpacity={0.8}
                  >
                    <Feather
                      name="gift"
                      size={18}
                      color="#FFFFFF"
                      style={{ marginRight: 8 }}
                    />
                    <Text style={[styles.selectButtonText, { fontWeight: '700' }]}>
                      {t('detailModal.supporterUnlockButton')}
                    </Text>
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            )}

            {/* Regular segment-based unlock button */}
            <View
              style={{
                shadowColor: '#D4AF37',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 6,
              }}
            >
              <LinearGradient
                colors={['#E5C158', '#D4AF37', '#C19A2E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 12,
                  overflow: 'hidden',
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.selectProjectButton,
                    {
                      backgroundColor: 'transparent',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
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
                  <Text style={[styles.selectButtonText, { fontWeight: '600' }]}>
                    {t('detailModal.unlockButton')}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
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
