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
import { TEXTS, FEEDBACK_CATEGORIES, CATEGORY_ICONS } from './constants';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';

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
            {TEXTS.FEEDBACK_CATEGORY_TITLE}
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
                      ? `${theme.colors.primary}15`
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
                      ? theme.colors.primary 
                      : themeStyles.secondaryText
                  }
                ]}>
                  {selectedCategory === cat.id && (
                    <View style={[
                      styles.categoryRadioSelected,
                      { backgroundColor: theme.colors.primary }
                    ]} />
                  )}
                </View>

                {/* Icon */}
                <View style={[
                  styles.categoryIconContainer,
                  { 
                    backgroundColor: `${theme.colors.primary}15`
                  }
                ]}>
                  <Feather
                    name={CATEGORY_ICONS[cat.id]}
                    size={20}
                    color={theme.colors.primary}
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
          <View style={{ marginTop: 'auto' }}>
            <TouchableOpacity
              style={[
                styles.buttonContainer,
                {
                  backgroundColor: selectedCategory
                    ? themeStyles.buttonBackground
                    : themeStyles.borderColor,
                  opacity: selectedCategory ? 1 : 0.5
                }
              ]}
              onPress={handleConfirm}
              disabled={!selectedCategory}
            >
              <Text style={styles.buttonText}>
                {TEXTS.FEEDBACK_CATEGORY_BUTTON}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default FeedbackCategoryModal;