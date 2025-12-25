// screens/Settings/components/EmailAuthModal/ForgotPasswordForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/contexts/color/ColorContext';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import { spacing, radius } from '@/utils/theme';
import { triggerHaptic } from '@/utils/haptics';
import { sendPasswordReset, isValidEmail, getEmailAuthErrorKey } from '@/utils/auth/emailAuth';

interface ForgotPasswordFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSuccess,
  onBack,
}) => {
  const { t } = useTranslation('settings');
  const { colors, isDark } = useTheme();
  const progressColor = useProgressColor();
  const { showAlert } = useAlert();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    // Validate email
    if (!isValidEmail(email)) {
      setEmailError(t('emailAuth.errors.invalidEmail'));
      return;
    }
    setEmailError('');

    setIsLoading(true);
    try {
      await sendPasswordReset(email);
      triggerHaptic('success');

      showAlert({
        title: t('emailAuth.forgotPassword.successTitle'),
        message: t('emailAuth.forgotPassword.success'),
        type: 'success',
        buttons: [
          {
            text: 'OK',
            style: 'primary',
            onPress: () => {
              onSuccess();
            },
          },
        ],
      });
    } catch (error: any) {
      triggerHaptic('error');
      const errorKey = getEmailAuthErrorKey(error.code);
      showAlert({
        title: t('emailAuth.errors.title'),
        message: t(`emailAuth.errors.${errorKey}`),
        type: 'error',
        buttons: [{ text: 'OK', style: 'primary', onPress: () => {} }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.length > 0;

  return (
    <View style={styles.container}>
      {/* Description */}
      <Text style={[styles.description, { color: colors.textSecondary }]}>
        {t('emailAuth.forgotPassword.description')}
      </Text>

      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('emailAuth.forgotPassword.email')}
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              borderColor: emailError ? '#FF3B30' : colors.border,
            },
          ]}
        >
          <Feather name="mail" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder={t('emailAuth.forgotPassword.emailPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>
        {emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor: progressColor,
            shadowColor: progressColor,
            opacity: isFormValid && !isLoading ? 1 : 0.6,
          },
        ]}
        onPress={handleSubmit}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>
            {t('emailAuth.forgotPassword.submit')}
          </Text>
        )}
      </TouchableOpacity>

      {/* Back to Login */}
      <TouchableOpacity
        onPress={onBack}
        style={styles.backButton}
        disabled={isLoading}
      >
        <Feather name="arrow-left" size={16} color={progressColor} />
        <Text style={[styles.backButtonText, { color: progressColor }]}>
          {t('emailAuth.forgotPassword.backToLogin')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.sm,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    height: 52,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginLeft: spacing.xs,
  },
  submitButton: {
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ForgotPasswordForm;
