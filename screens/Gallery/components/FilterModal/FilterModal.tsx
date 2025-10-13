// screens/GalleryScreen/components/FilterModal/FilterModal.tsx
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import {
  BottomSheetModal as GorhomBottomSheetModal,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useProgressColor } from "@/hooks/useProgressColor";
import { useNavigation } from '@/contexts/navigation';
import { spacing, radius } from "@/utils/theme";
import {
  LANDSCAPE_CATEGORIES,
  LandscapeCategory,
} from "@/screens/Gallery/utils/landscapes/data";
import CategoryGrid from "./components/CategoryGrid";
import InfoSection from "./components/InfoSection";
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
  onTempCategoriesChange?: (categories: LandscapeCategory[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  selectedCategories,
  onApplyFilter,
  totalImages,
  filteredCount,
  allLandscapes = [],
  onTempCategoriesChange,
}) => {
  const { t } = useTranslation('gallery');
  const theme = useTheme();
  const { colors } = theme;
  const progressColor = useProgressColor();
  const bottomSheetRef = useRef<GorhomBottomSheetModal>(null);
  const { hideBottomNav, resetBottomNav } = useNavigation();

  const [tempSelectedCategories, setTempSelectedCategories] =
    useState<LandscapeCategory[]>(selectedCategories);

  const snapPoints = useMemo(() => ['50%', '90%'], []);

  useEffect(() => {
    setTempSelectedCategories(selectedCategories);
  }, [selectedCategories]);

  // Notify parent about temp categories changes
  useEffect(() => {
    if (onTempCategoriesChange) {
      onTempCategoriesChange(tempSelectedCategories);
    }
  }, [tempSelectedCategories, onTempCategoriesChange]);

  // Open/close modal based on visible prop
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
    (props: any) => <BottomSheetHandle {...props} isDark={theme.isDark} />,
    [theme.isDark]
  );

  // Render custom backdrop with blur
  const renderBackdrop = useCallback(
    (props: any) => (
      <CustomBottomSheetBackdrop
        {...props}
        isDark={theme.isDark}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [theme.isDark]
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
          <Text style={[styles.title, { color: colors.textPrimary }]}>
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
    fontSize: 22,
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
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
