// screens/GalleryScreen/components/FilterModal/FilterModal.tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetScrollView,
  BottomSheetFooter,
} from '@gorhom/bottom-sheet';
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useProgressColor } from "@/hooks/useProgressColor";
import { useNavigation } from '@/contexts/navigation';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { spacing, radius } from "@/utils/theme";
import {
  LANDSCAPE_CATEGORIES,
  LandscapeCategory,
} from "@/screens/Gallery/utils/landscapes/data";
import CategoryGrid from "./components/CategoryGrid";
import InfoSection from "./components/InfoSection";
import { darkenColor } from "@/screens/GameCompletion/components/GalleryProgressCard/utils/colorHelpers";
import BottomSheetHandle from '@/components/BottomSheetModal/BottomSheetHandle';
import CustomBottomSheetBackdrop from '@/components/BottomSheetModal/BottomSheetBackdrop';

export interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedCategories: LandscapeCategory[];
  onApplyFilter: (categories: LandscapeCategory[]) => void;
  totalImages: number;
  filteredCount: number;
  allLandscapes?: any[];
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
  const { t } = useTranslation('gallery');
  const { colors, typography, isDark } = useTheme();
  const progressColor = useProgressColor();
  const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);
  const { hideBottomNav, resetBottomNav } = useNavigation();
  const insets = useSafeAreaInsets();

  const [tempSelectedCategories, setTempSelectedCategories] =
    useState<LandscapeCategory[]>(selectedCategories);

  const snapPoints = useMemo(() => ['50%', '90%'], []);

  useEffect(() => {
    setTempSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  // Notify parent about temp categories changes
  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.present();
    } else {
      bottomSheetRef.current?.dismiss();
    }
  }, [visible]);

  // Hide BottomNav when modal is visible
  useEffect(() => {
    if (visible) {
      hideBottomNav();
    }
    return () => {
      resetBottomNav();
    };
  }, [visible, hideBottomNav, resetBottomNav]);

  const handleDismiss = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleCategoryToggle = (category: LandscapeCategory) => {
    setTempSelectedCategories((prev) => {
      const isSelected = prev.includes(category);
      if (isSelected) {
        return prev.filter((c) => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleSelectAll = () => {
    setTempSelectedCategories([]);
  };

  const handleApply = () => {
    onApplyFilter(tempSelectedCategories);
    onClose();
  };

  const allCategoriesSelected =
    tempSelectedCategories.length === 0 ||
    tempSelectedCategories.length === Object.keys(LANDSCAPE_CATEGORIES).length;

  // Render custom handle
  const renderHandle = useCallback(
    (props: any) => <BottomSheetHandle {...props} isDark={isDark} />,
    [isDark]
  );

  // Render custom backdrop with blur
  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBottomSheetBackdrop
        {...props}
        isDark={isDark}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [isDark]
  );

  // Render footer with Apply button
  const renderFooter = useCallback(
    (props: any) => (
      <BottomSheetFooter {...props} bottomInset={insets.bottom}>
        <View
          style={[
            styles.footer,
            {
              backgroundColor: colors.surface,
              borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              paddingBottom: Math.max(insets.bottom, 16) + 8,
            },
          ]}
        >
          <Pressable
            onPress={handleApply}
            style={({ pressed }) => [
              styles.applyButton,
              {
                backgroundColor: pressed
                  ? darkenColor(progressColor, 20)
                  : progressColor,
                shadowColor: progressColor,
              },
            ]}
          >
            <Feather name="filter" size={18} color="#FFFFFF" />
            <Text style={[styles.applyButtonText, { fontSize: typography.size.md }]}>
              {t('filterModal.applyFilter')}
            </Text>
            <Feather name="arrow-right" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </BottomSheetFooter>
    ),
    [colors.surface, isDark, insets.bottom, handleApply, progressColor, t, typography]
  );

  if (!visible) return null;

  return (
    <GorhomBottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={0}
        onDismiss={handleDismiss}
        enablePanDownToClose
        handleComponent={renderHandle}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        backgroundStyle={{
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
        }}
      >
        {/* Header: Title */}
        <View style={[styles.header, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.size.xl }]}>
            {t('filterModal.title')}
          </Text>
        </View>

        {/* Scrollable Content */}
        <BottomSheetScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {/* Filter Section */}
          <View style={styles.section}>
            {/* All Categories Button */}
            <TouchableOpacity
              style={[
                styles.allButton,
                {
                  borderColor: allCategoriesSelected
                    ? progressColor
                    : colors.border,
                  backgroundColor: allCategoriesSelected
                    ? progressColor
                    : "transparent",
                  borderWidth: 2,
                },
              ]}
              onPress={handleSelectAll}
            >
              <Text
                style={[
                  styles.allButtonText,
                  {
                    color: allCategoriesSelected
                      ? "#FFFFFF"
                      : colors.textPrimary,
                    fontSize: typography.size.md,
                  },
                ]}
              >
                {t('filterModal.allCategories')}
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

          {/* Spacer for fixed button */}
          <View style={{ height: 100 }} />
        </BottomSheetScrollView>
      </GorhomBottomSheetModal>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomWidth: 0,
  },
  title: {
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  section: {
    marginBottom: spacing.xl,
  },
  infoSectionContainer: {
    marginTop: spacing.lg,
  },
  allButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  allButtonText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.lg,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  applyButtonText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default FilterModal;
