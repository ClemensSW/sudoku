// screens/Settings/components/ReviewSystem/views/DetailView.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
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
  isSubmitting?: boolean;
}

const DetailView: React.FC<DetailViewProps> = ({
  category,
  rating,
  onSubmit,
  isSubmitting = false
}) => {
  const { t } = useTranslation('feedback');
  const [details, setDetails] = useState('');
  const [email, setEmail] = useState('');
  const detailsInputRef = useRef<TextInput>(null);
  const { isDark, typography } = useTheme();
  const themeStyles = getThemeStyles(isDark);

  // Focus on mount
  useEffect(() => {
    setTimeout(() => {
      detailsInputRef.current?.focus();
    }, 300);
  }, []);

  // Handle submission
  const handleSubmit = () => {
    if (details.trim().length === 0 || isSubmitting) return;

    // Dismiss keyboard first
    Keyboard.dismiss();

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
              borderWidth: 1,
              fontSize: typography.size.md
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
                backgroundColor: details.trim().length > 0 && !isSubmitting
                  ? '#FFCB2B'
                  : themeStyles.borderColor,
                opacity: isSubmitting ? 0.7 : 1,
              }
            ]}
            onPress={handleSubmit}
            disabled={details.trim().length === 0 || isSubmitting}
            activeOpacity={0.8}
          >
            {isSubmitting ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <ActivityIndicator size="small" color="#1A1A1A" />
                <Text style={[
                  styles.buttonText,
                  { color: '#1A1A1A', fontSize: typography.size.md }
                ]}>
                  {t('detail.submitting')}
                </Text>
              </View>
            ) : (
              <Text style={[
                styles.buttonText,
                {
                  color: '#1A1A1A',
                  opacity: details.trim().length > 0 ? 1 : 0.5,
                  fontSize: typography.size.md
                }
              ]}>
                {t('detail.button')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default DetailView;
