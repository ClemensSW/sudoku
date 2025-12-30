// screens/GalleryScreen/components/FilterModal/components/CategoryGrid.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { LANDSCAPE_CATEGORIES, LandscapeCategory, getCategoryName } from "@/screens/Gallery/utils/landscapes/data";
import { spacing, radius } from "@/utils/theme";
import { useProgressColor } from "@/hooks/useProgressColor";
import { useTranslation } from "react-i18next";

interface CategoryGridProps {
  selectedCategories: LandscapeCategory[];
  onToggleCategory: (category: LandscapeCategory) => void;
  allSelected: boolean;
  onSelectAll: () => void;
}

// "Alle"-Chip Komponente
const AllChip: React.FC<{
  isSelected: boolean;
  onPress: () => void;
}> = ({ isSelected, onPress }) => {
  const { t } = useTranslation('gallery');
  const theme = useTheme();
  const { colors, typography, isDark } = theme;
  const progressColor = useProgressColor();

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.allChip,
          isSelected
            ? {
                backgroundColor: progressColor,
                borderColor: progressColor,
                borderStyle: 'solid',
              }
            : {
                backgroundColor: 'transparent',
                borderColor: colors.border,
                borderStyle: 'dashed',
              },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <Feather
          name="layers"
          size={14}
          color={isSelected ? '#FFFFFF' : colors.textSecondary}
        />
        <Text
          style={[
            styles.allChipText,
            {
              color: isSelected ? '#FFFFFF' : colors.textSecondary,
              fontSize: typography.size.sm,
            },
          ]}
        >
          {t('filterModal.allChip')}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Kategorie-Chip Komponente mit subtilerem Selection-Style
const CategoryChip: React.FC<{
  category: LandscapeCategory;
  isSelected: boolean;
  onPress: () => void;
}> = ({ category, isSelected, onPress }) => {
  const theme = useTheme();
  const { colors, typography, isDark } = theme;
  const progressColor = useProgressColor();

  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Subtilere Selection-Farben
  const selectedBgColor = isDark
    ? `${progressColor}33` // ~20% opacity
    : `${progressColor}26`; // ~15% opacity

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[
          styles.categoryChip,
          {
            borderColor: isSelected ? progressColor : colors.border,
            backgroundColor: isSelected ? selectedBgColor : 'transparent',
          },
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.chipText,
            {
              color: isSelected ? progressColor : colors.textPrimary,
              fontSize: typography.size.sm,
              fontWeight: isSelected ? '700' : '600',
            },
          ]}
        >
          {getCategoryName(category)}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CategoryGrid: React.FC<CategoryGridProps> = ({
  selectedCategories,
  onToggleCategory,
  allSelected,
  onSelectAll,
}) => {
  const categories = Object.keys(LANDSCAPE_CATEGORIES) as LandscapeCategory[];

  return (
    <View style={styles.grid}>
      {/* "Alle"-Chip als erstes Element */}
      <AllChip
        isSelected={allSelected}
        onPress={onSelectAll}
      />

      {/* Kategorie-Chips */}
      {categories.map((category) => (
        <CategoryChip
          key={category}
          category={category}
          isSelected={!allSelected && selectedCategories.includes(category)}
          onPress={() => onToggleCategory(category)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -spacing.xs / 2,
  },

  allChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    margin: spacing.xs / 2,
    borderRadius: radius.xl,
    borderWidth: 2,
  },

  allChipText: {
    fontWeight: "600",
  },

  categoryChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    margin: spacing.xs / 2,
    borderRadius: radius.xl,
    borderWidth: 2,
  },

  chipText: {
    // fontWeight set dynamically
  },
});

export default CategoryGrid;
