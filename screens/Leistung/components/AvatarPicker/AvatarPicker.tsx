// components/AvatarPicker/AvatarPicker.tsx
import React, { useState, useEffect, useMemo, useRef } from "react";
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
import BottomSheetModal from "@/components/BottomSheetModal/BottomSheetModal";
import DefaultAvatars, { AvatarCategory } from "./DefaultAvatars";
import styles from "./styles";

interface AvatarPickerProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string | null) => void;
  currentAvatarUri: string | null;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  visible,
  onClose,
  onImageSelected,
  currentAvatarUri,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<AvatarCategory>('Cartoon');

  // Tab measurements for animated indicator
  const tabMeasurements = useRef<{
    [key in AvatarCategory]?: { x: number; width: number };
  }>({});
  const tabIndicatorWidth = useSharedValue(0);
  const tabIndicatorPosition = useSharedValue(0);

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

    // If this is the active tab and it's being measured for the first time,
    // update the indicator position and width immediately
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
    ],
    []
  );

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={t('avatarPicker.title')}
      isDark={theme.isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['70%', '90%']}
      initialSnapIndex={0}
    >
      {/* Tab Navigation */}
      <View
        style={[
          styles.tabContainer,
          {
            backgroundColor: theme.isDark
              ? "rgba(255,255,255,0.03)"
              : "rgba(0,0,0,0.03)",
          },
        ]}
      >
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            style={[
              styles.tabButton,
              activeCategory === tab.id && {
                backgroundColor: theme.isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)",
              },
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
                  fontWeight: activeCategory === tab.id ? '600' : '400',
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

      {/* Tab Content */}
      <DefaultAvatars
        currentAvatarUri={currentAvatarUri}
        onImageSelected={onImageSelected}
        onLoading={setIsLoading}
        onClose={onClose}
        activeCategory={activeCategory}
      />

      {/* Loading Indicator */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </BottomSheetModal>
  );
};

export default AvatarPicker;
