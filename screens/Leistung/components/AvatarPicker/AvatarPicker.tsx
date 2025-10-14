// components/AvatarPicker/AvatarPicker.tsx
import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import BottomSheetModalWithFlatList from "@/components/BottomSheetModal/BottomSheetModalWithFlatList";
import { AvatarCategory } from "./DefaultAvatars";
import { DefaultAvatar, defaultAvatars } from "../../utils/defaultAvatars";
import { saveDefaultAvatar } from "../../utils/avatarStorage";
import AvatarOption from "./AvatarOption";
import styles from "./styles";

interface AvatarPickerProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string | null) => void;
  currentAvatarUri: string | null;
  /** Ob das Modal die Bottom Navigation verwalten soll. Default: true */
  managesBottomNav?: boolean;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  visible,
  onClose,
  onImageSelected,
  currentAvatarUri,
  managesBottomNav = true,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('Cartoon');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  // Tab measurements for animated indicator
  const tabMeasurements = useRef<{
    [key in AvatarCategory]?: { x: number; width: number };
  }>({});
  const tabIndicatorWidth = useSharedValue(0);
  const tabIndicatorPosition = useSharedValue(0);

  // Set initial selected avatar
  useEffect(() => {
    if (currentAvatarUri?.startsWith('default://')) {
      setSelectedAvatar(currentAvatarUri.replace('default://', ''));
    }
  }, [currentAvatarUri]);

  // Update indicator when active category changes
  useEffect(() => {
    const currentTabMeasurements = tabMeasurements.current[activeCategory];

    if (currentTabMeasurements) {
      tabIndicatorPosition.value = withTiming(currentTabMeasurements.x, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
      tabIndicatorWidth.value = withTiming(currentTabMeasurements.width, {
        duration: 250,
        easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      });
    }
  }, [activeCategory]);

  // Measure tab layout
  const measureTab = (category: AvatarCategory, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    tabMeasurements.current[category] = { x, width };

    if (category === activeCategory && tabIndicatorWidth.value === 0) {
      tabIndicatorPosition.value = x;
      tabIndicatorWidth.value = width;
    }
  };

  // Animation style for tab indicator
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabIndicatorPosition.value }],
      width: tabIndicatorWidth.value,
    };
  });

  const tabs: { id: AvatarCategory; label: string }[] = useMemo(
    () => [
      { id: 'Cartoon', label: 'Cartoon' },
      { id: 'Anime', label: 'Anime' },
      { id: 'Tiere', label: 'Tiere' },
    ],
    []
  );

  // Filter avatars by active category - memoized for performance
  const avatarsToShow = useMemo(() => {
    return defaultAvatars.filter(avatar => avatar.category === activeCategory);
  }, [activeCategory]);

  const handleSelectAvatar = useCallback(async (avatar: DefaultAvatar) => {
    try {
      setIsLoading(true);

      const avatarPath = await saveDefaultAvatar(avatar.id);
      setSelectedAvatar(avatar.id);
      onImageSelected(avatarPath);

      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.error('Error selecting default avatar:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onImageSelected, onClose]);

  // Render item for BottomSheetFlatList
  const renderItem = useCallback(({ item }: { item: DefaultAvatar }) => (
    <View style={styles.avatarWrapper}>
      <AvatarOption
        avatar={item}
        isSelected={selectedAvatar === item.id}
        onSelect={handleSelectAvatar}
        isNew={false}
      />
    </View>
  ), [selectedAvatar, handleSelectAvatar]);

  // Key extractor
  const keyExtractor = useCallback((item: DefaultAvatar) => item.id, []);

  // Tab Navigation Header (Gallery Style)
  const TabNavigationHeader = useCallback(() => (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          style={({ pressed }) => [
            styles.tabButton,
            activeCategory === tab.id && {
              backgroundColor: theme.isDark
                ? "rgba(138, 180, 248, 0.12)"
                : "rgba(66, 133, 244, 0.08)",
            },
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => setActiveCategory(tab.id)}
          onLayout={(event) => measureTab(tab.id, event)}
        >
          <Text
            style={[
              styles.tabButtonText,
              {
                color:
                  activeCategory === tab.id
                    ? colors.primary
                    : colors.textSecondary,
                fontWeight: activeCategory === tab.id ? '600' : '500',
              },
            ]}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}

      {/* Active Tab Indicator */}
      <Animated.View
        style={[
          styles.activeTabIndicator,
          { backgroundColor: colors.primary },
          tabIndicatorStyle,
        ]}
      />
    </View>
  ), [tabs, activeCategory, theme.isDark, colors.primary, colors.textSecondary, tabIndicatorStyle]);

  return (
    <>
      <BottomSheetModalWithFlatList
        visible={visible}
        onClose={onClose}
        title={t('avatarPicker.title')}
        data={avatarsToShow}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={3}
        isDark={theme.isDark}
        textPrimaryColor={colors.textPrimary}
        surfaceColor={colors.surface}
        borderColor={colors.border}
        snapPoints={['70%', '90%']}
        initialSnapIndex={0}
        contentContainerStyle={styles.gridContainer}
        ListFooterComponent={TabNavigationHeader}
        managesBottomNav={managesBottomNav}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </>
  );
};

export default AvatarPicker;
