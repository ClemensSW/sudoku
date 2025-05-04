// FeedbackCategoryModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  TouchableWithoutFeedback
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
  const [fadeAnim] = useState(new Animated.Value(0));
  const theme = useTheme();
  const themeStyles = getThemeStyles(theme.isDark);

  // Animation beim Öffnen/Schließen
  useEffect(() => {
    if (visible) {
      setSelectedCategory(null); // Reset beim Öffnen
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  // Kategorie auswählen
  const handleCategorySelect = (category: FeedbackCategory) => {
    triggerHaptic('light');
    setSelectedCategory(category);
  };

  // Auswahl bestätigen
  const handleConfirm = () => {
    if (selectedCategory) {
      triggerHaptic('medium');
      onSelectCategory(selectedCategory);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContainer,
                {
                  backgroundColor: themeStyles.background,
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [20, 0]
                      })
                    }
                  ]
                }
              ]}
            >
              {/* Close Button */}
              <TouchableOpacity
                style={styles.closeButton}
                onPress={onClose}
                hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <Feather name="x" size={24} color={themeStyles.secondaryText} />
              </TouchableOpacity>

              {/* Header */}
              <Text style={[styles.titleText, { color: themeStyles.text }]}>
                {TEXTS.FEEDBACK_CATEGORY_TITLE}
              </Text>

              {/* Categories */}
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
                    {/* Radio Circle */}
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

              {/* Action Button */}
              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  {
                    backgroundColor: selectedCategory
                      ? themeStyles.buttonBackground
                      : themeStyles.borderColor,
                    opacity: selectedCategory ? 1 : 0.7
                  }
                ]}
                onPress={handleConfirm}
                disabled={!selectedCategory}
              >
                <Text style={styles.buttonText}>
                  {TEXTS.FEEDBACK_CATEGORY_BUTTON}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FeedbackCategoryModal;