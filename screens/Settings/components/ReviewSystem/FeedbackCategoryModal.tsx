// screens/SettingsScreen/components/ReviewSystem/FeedbackCategoryModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles, getThemeStyles } from './styles';
import { FeedbackCategory } from './types';
import { CATEGORY_ICONS } from './constants';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';
import { useTranslation } from 'react-i18next';

interface FeedbackCategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCategory: (category: FeedbackCategory) => void;
}

const FeedbackCategoryModal: React.FC<FeedbackCategoryModalProps> = ({
  visible,
  onClose,
  onSelectCategory
}) => {
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

  // Reset selection when modal opens
  useEffect(() => {
    if (visible) {
      setSelectedCategory(null);
    }
  }, [visible]);

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
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView 
        style={[styles.fullscreenModal, { backgroundColor: themeStyles.background }]}
      >
        <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} />
        
        {/* Header Bar */}
        <View 
          style={[
            styles.headerBar, 
            { borderBottomColor: themeStyles.borderColor }
          ]}
        >
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 15, right: 15, bottom: 15, left: 15 }}>
            <Feather name="arrow-left" size={24} color={themeStyles.text} />
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, { color: themeStyles.text }]}>
            {t('category.title')}
          </Text>
          
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.fullscreenContent}>
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
                      ? 'rgba(255, 203, 43, 0.15)'
                      : 'transparent'
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
                    backgroundColor: 'rgba(255, 203, 43, 0.15)'
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
                  color: theme.isDark ? '#1A1A1A' : '#FFFFFF',
                  opacity: selectedCategory ? 1 : 0.5
                }
              ]}>
                {t('category.button')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FeedbackCategoryModal;