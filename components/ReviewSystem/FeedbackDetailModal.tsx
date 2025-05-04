// components/ReviewSystem/FeedbackDetailModal.tsx

import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles, getThemeStyles } from './styles';
import { FeedbackData, FeedbackCategory } from './types';
import { TEXTS, FEEDBACK_CATEGORIES } from './constants';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';

interface FeedbackDetailModalProps {
  visible: boolean;
  category: FeedbackCategory | null;
  rating: number;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => void;
}

const FeedbackDetailModal: React.FC<FeedbackDetailModalProps> = ({
  visible,
  category,
  rating,
  onClose,
  onSubmit
}) => {
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));
  const detailsInputRef = useRef<TextInput>(null);
  const theme = useTheme();
  const themeStyles = getThemeStyles(theme.isDark);

  // Kategorie-Label abrufen
  const getCategoryLabel = () => {
    if (!category) return '';
    const found = FEEDBACK_CATEGORIES.find(cat => cat.id === category);
    return found ? found.label : '';
  };

  // Animation beim Öffnen/Schließen
  useEffect(() => {
    if (visible) {
      setDetails(''); // Reset beim Öffnen
      setEmail('');
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();

      // Verzögerung für den Fokus, damit die Animation zuerst läuft
      setTimeout(() => {
        detailsInputRef.current?.focus();
      }, 500);
    } else {
      fadeAnim.setValue(0);
    }
  }, [visible, fadeAnim]);

  // Feedback absenden
  const handleSubmit = () => {
    triggerHaptic('medium');
    
    const feedbackData: FeedbackData = {
      rating,
      category: category || undefined,
      details: details.trim() || undefined,
      email: email.trim() || undefined
    };
    
    onSubmit(feedbackData);
    setDetails('');
    setEmail('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.modalBackground}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
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

              <ScrollView
                style={{ width: '100%' }}
                contentContainerStyle={{ alignItems: 'center' }}
                keyboardShouldPersistTaps="handled"
              >
                {/* Header */}
                <Text style={[styles.titleText, { color: themeStyles.text }]}>
                  {TEXTS.FEEDBACK_DETAIL_TITLE}
                </Text>
                
                {/* Category Label */}
                {category && (
                  <Text
                    style={[
                      styles.subtitleText,
                      { color: themeStyles.secondaryText, marginBottom: 16 }
                    ]}
                  >
                    {getCategoryLabel()}
                  </Text>
                )}

                {/* Feedback Text Input */}
                <TextInput
                  ref={detailsInputRef}
                  style={[
                    styles.feedbackInput,
                    {
                      backgroundColor: themeStyles.inputBackground,
                      color: themeStyles.text,
                      borderColor: themeStyles.borderColor,
                      borderWidth: 1
                    }
                  ]}
                  placeholder={TEXTS.FEEDBACK_DETAIL_PLACEHOLDER}
                  placeholderTextColor={themeStyles.secondaryText}
                  multiline
                  textAlignVertical="top"
                  value={details}
                  onChangeText={setDetails}
                />

                {/* Optional Email */}
                <TextInput
                  style={[
                    styles.emailInput,
                    {
                      backgroundColor: themeStyles.inputBackground,
                      color: themeStyles.text,
                      borderColor: themeStyles.borderColor,
                      borderWidth: 1
                    }
                  ]}
                  placeholder={TEXTS.FEEDBACK_DETAIL_EMAIL_PLACEHOLDER}
                  placeholderTextColor={themeStyles.secondaryText}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={email}
                  onChangeText={setEmail}
                />

                {/* Submit Button */}
                <TouchableOpacity
                  style={[
                    styles.buttonContainer,
                    {
                      backgroundColor: details.trim().length > 0
                        ? themeStyles.buttonBackground
                        : themeStyles.borderColor,
                      opacity: details.trim().length > 0 ? 1 : 0.7
                    }
                  ]}
                  onPress={handleSubmit}
                  disabled={details.trim().length === 0}
                >
                  <Text style={styles.buttonText}>
                    {TEXTS.FEEDBACK_DETAIL_BUTTON}
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </Animated.View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default FeedbackDetailModal;