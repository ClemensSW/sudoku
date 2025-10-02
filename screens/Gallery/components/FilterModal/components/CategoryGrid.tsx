// screens/GalleryScreen/components/FilterModal/components/CategoryGrid.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { LANDSCAPE_CATEGORIES, LandscapeCategory, getCategoryName } from "@/screens/Gallery/utils/landscapes/data";
import { spacing, radius } from "@/utils/theme";

interface CategoryGridProps {
  selectedCategories: LandscapeCategory[];
  onToggleCategory: (category: LandscapeCategory) => void;
  allSelected: boolean;
}

const CategoryChip: React.FC<{
  category: LandscapeCategory;
  isSelected: boolean;
  onPress: () => void;
}> = ({ category, isSelected, onPress }) => {
  const theme = useTheme();
  const { colors } = theme;
  
  // Animation values
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
          styles.categoryChip,
          {
            borderColor: isSelected ? colors.primary : colors.border,
            backgroundColor: isSelected ? colors.primary : "transparent",
            borderWidth: 2, // Immer 2px Border
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
            { color: isSelected ? "#FFFFFF" : colors.textPrimary },
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
}) => {
  // Kategorien direkt aus data.ts
  const categories = Object.keys(LANDSCAPE_CATEGORIES) as LandscapeCategory[];
  
  return (
    <View style={styles.grid}>
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
  
  categoryChip: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    margin: spacing.xs / 2,
    borderRadius: radius.xl,
    borderWidth: 2, // Immer 2px Border
  },
  
  chipText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default CategoryGrid;