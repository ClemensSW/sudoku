// screens/Settings/components/ReviewSystem/views/DetailView.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { styles, getThemeStyles } from '../styles';
import { FeedbackData, FeedbackCategory, Rating } from '../types';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { triggerHaptic } from '@/utils/haptics';
import { useTranslation } from 'react-i18next';

interface DetailViewProps {
  category: FeedbackCategory | null;
  rating: Rating;
  onSubmit: (data: FeedbackData) => void;
}

const DetailView: React.FC<DetailViewProps> = ({
  category,
  rating,
  onSubmit
}) => {
  const { t } = useTranslation('feedback');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const detailsInputRef = useRef<TextInput>(null);
  const theme = useTheme();
  const themeStyles = getThemeStyles(theme.isDark);

  // Focus on mount
  useEffect(() => {
    setTimeout(() => {
      detailsInputRef.current?.focus();
    }, 300);
  }, []);

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <View style={styles.detailViewContainer}>
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

        {/* Submit Button */}
        <View style={{ marginTop: 'auto', width: '100%' }}>
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
  );
};

export default DetailView;
