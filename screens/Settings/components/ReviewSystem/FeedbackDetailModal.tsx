// screens/SettingsScreen/components/ReviewSystem/FeedbackDetailModal.tsx
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
  SafeAreaView,
  StatusBar
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Feather } from '@expo/vector-icons';
import { styles, getThemeStyles } from './styles';
import { FeedbackData, FeedbackCategory, Rating } from './types';
import { TEXTS } from './constants';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';

interface FeedbackDetailModalProps {
  visible: boolean;
  category: FeedbackCategory | null;
  rating: Rating;
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
  const { t } = useTranslation('feedback');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const detailsInputRef = useRef<TextInput>(null);
  const theme = useTheme();
  const themeStyles = getThemeStyles(theme.isDark);

  // Reset and focus on open
  useEffect(() => {
    if (visible) {
      setDetails('');
      setEmail('');
      
      // Focus the text input after a short delay
      setTimeout(() => {
        detailsInputRef.current?.focus();
      }, 300);
    }
  }, [visible]);

  // Handle submission
  const handleSubmit = () => {
    if (details.trim().length === 0) return;
    
    triggerHaptic('medium');
    
    const feedbackData: FeedbackData = {
      rating,
      category: category || undefined,
      details: details.trim(),
      email: email.trim() || undefined
    };
    
    onSubmit(feedbackData);
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
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <View style={styles.fullscreenContent}>
            {/* Main Feedback Input */}
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
              placeholder={t('detail.placeholder')}
              placeholderTextColor={themeStyles.secondaryText}
              multiline
              textAlignVertical="top"
              value={details}
              onChangeText={setDetails}
              autoFocus={false}
            />

            {/* Submit Button - Fixed at bottom */}
            <View style={{ marginTop: 'auto', paddingBottom: Platform.OS === 'android' ? 16 : 0, width: '100%' }}>
              <TouchableOpacity
                style={[
                  styles.buttonContainer,
                  {
                    backgroundColor: details.trim().length > 0 ? '#FFCB2B' : themeStyles.borderColor,
                  }
                ]}
                onPress={handleSubmit}
                disabled={details.trim().length === 0}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.buttonText,
                  {
                    color: theme.isDark ? '#1A1A1A' : '#FFFFFF',
                    opacity: details.trim().length > 0 ? 1 : 0.5
                  }
                ]}>
                  {t('detail.button')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

export default FeedbackDetailModal;