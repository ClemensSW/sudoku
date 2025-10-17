// screens/Settings/components/ReviewSystem/views/CategoryView.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles, getThemeStyles } from '../styles';
import { FeedbackCategory } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';
import { useTranslation } from 'react-i18next';

interface CategoryViewProps {
  onSelectCategory: (category: FeedbackCategory) => void;
}

const CategoryView: React.FC<CategoryViewProps> = ({ onSelectCategory }) => {
  const [selectedCategory, setSelectedCategory] = useState<FeedbackCategory | null>(null);
  const theme = useTheme();
  const themeStyles = getThemeStyles(theme.isDark);
  const { t } = useTranslation('feedback');

  const FEEDBACK_CATEGORIES: Array<{id: FeedbackCategory, label: string}> = [
    { id: 'problem', label: t('category.options.problem') },
    { id: 'idea', label: t('category.options.idea') },
    { id: 'missing', label: t('category.options.missing') },
    { id: 'complicated', label: t('category.options.complicated') },
    { id: 'other', label: t('category.options.other') }
  ];

  // Handle category selection
  const handleCategorySelect = (category: FeedbackCategory) => {
    triggerHaptic('light');
    setSelectedCategory(category);
  };

  // Confirm selection
  const handleConfirm = () => {
    if (selectedCategory) {
      triggerHaptic('medium');
      onSelectCategory(selectedCategory);
    }
  };

  return (
    <View style={styles.categoryViewContainer}>
      {/* Categories List */}
      <ScrollView
        style={styles.categoriesContainer}
        showsVerticalScrollIndicator={false}
      >
        {FEEDBACK_CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryItem,
              {
                backgroundColor: selectedCategory === cat.id
                  ? (theme.isDark ? 'rgba(255, 203, 43, 0.15)' : 'rgba(255, 203, 43, 0.08)')
                  : 'transparent',
                borderWidth: selectedCategory === cat.id ? 1 : 0,
                borderColor: selectedCategory === cat.id ? '#FFCB2B' : 'transparent',
              }
            ]}
            onPress={() => handleCategorySelect(cat.id)}
            activeOpacity={0.7}
          >
            {/* Radio Button */}
            <View style={[
              styles.categoryRadio,
              {
                borderColor: selectedCategory === cat.id
                  ? '#FFCB2B'
                  : themeStyles.secondaryText
              }
            ]}>
              {selectedCategory === cat.id && (
                <View style={[
                  styles.categoryRadioSelected,
                  { backgroundColor: '#FFCB2B' }
                ]} />
              )}
            </View>

            {/* Icon */}
            <View style={[
              styles.categoryIconContainer,
              {
                backgroundColor: theme.isDark
                  ? 'rgba(255, 203, 43, 0.15)'
                  : 'rgba(255, 203, 43, 0.12)'
              }
            ]}>
              <Feather
                name={CATEGORY_ICONS[cat.id]}
                size={20}
                color="#FFCB2B"
              />
            </View>

            {/* Label */}
            <Text style={[
              styles.categoryLabel,
              { color: themeStyles.text }
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <View style={{ marginTop: 'auto', width: '100%' }}>
        <TouchableOpacity
          style={[
            styles.buttonContainer,
            {
              backgroundColor: selectedCategory ? '#FFCB2B' : themeStyles.borderColor,
            }
          ]}
          onPress={handleConfirm}
          disabled={!selectedCategory}
          activeOpacity={0.8}
        >
          <Text style={[
            styles.buttonText,
            {
              color: '#1A1A1A', // Always dark on yellow button
              opacity: selectedCategory ? 1 : 0.5
            }
          ]}>
            {t('category.button')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CategoryView;
