// screens/Settings/components/EmailAuthModal/LoginForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/contexts/color/ColorContext';
import { spacing, radius } from '@/utils/theme';
import { isValidEmail } from '@/utils/auth/emailAuth';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  onForgotPassword: () => void;
  isLoading: boolean;
  initialEmail?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onForgotPassword,
  isLoading,
  initialEmail = '',
}) => {
  const { t } = useTranslation('settings');
  const theme = useTheme();
  const { colors, isDark, typography } = theme;
  const progressColor = useProgressColor();

  const [email, setEmail] = useState(initialEmail);

  // Update email when initialEmail prop changes
  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tempShowPassword, setTempShowPassword] = useState(false);
  const hidePasswordTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [emailError, setEmailError] = useState('');

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hidePasswordTimeout.current) {
        clearTimeout(hidePasswordTimeout.current);
      }
    };
  }, []);

  // Get masked password display (dots + last char visible)
  const getMaskedDisplay = (): string => {
    if (password.length === 0) return '';
    if (showPassword) return password;
    if (tempShowPassword && password.length > 0) {
      // Show dots for all except last character
      return '•'.repeat(password.length - 1) + password.slice(-1);
    }
    return '•'.repeat(password.length);
  };

  // Handle password change with temporary reveal
  const handlePasswordChange = (text: string) => {
    // Clear any existing timeout
    if (hidePasswordTimeout.current) {
      clearTimeout(hidePasswordTimeout.current);
    }

    const isAdding = text.length > password.length;
    setPassword(text);

    // Only show last char temporarily when adding characters (not deleting)
    if (isAdding && !showPassword) {
      setTempShowPassword(true);

      // Hide after 2 seconds
      hidePasswordTimeout.current = setTimeout(() => {
        setTempShowPassword(false);
      }, 2000);
    } else if (!isAdding) {
      // When deleting, hide immediately
      setTempShowPassword(false);
    }
  };

  const handleSubmit = async () => {
    // Validate email
    if (!isValidEmail(email)) {
      setEmailError(t('emailAuth.errors.invalidEmail'));
      return;
    }
    setEmailError('');

    await onSubmit(email, password);
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <View style={styles.container}>
      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
          {t('emailAuth.login.email')}
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
          <BottomSheetTextInput
            style={[styles.input, { color: colors.textPrimary, fontSize: typography.size.md }]}
            placeholder={t('emailAuth.login.emailPlaceholder')}
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (emailError) setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
            editable={!isLoading}
          />
        </View>
        {emailError ? (
          <Text style={[styles.errorText, { fontSize: typography.size.xs }]}>{emailError}</Text>
        ) : null}
      </View>

      {/* Password Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary, fontSize: typography.size.sm }]}>
          {t('emailAuth.login.password')}
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              borderColor: colors.border,
            },
          ]}
        >
          <Feather name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <View style={styles.passwordInputWrapper}>
            <BottomSheetTextInput
              style={[
                styles.input,
                { color: tempShowPassword && !showPassword ? 'transparent' : colors.textPrimary, fontSize: typography.size.md }
              ]}
              placeholder={t('emailAuth.login.passwordPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {tempShowPassword && !showPassword && password.length > 0 && (
              <Text style={[styles.maskedOverlay, { color: colors.textPrimary, fontSize: typography.size.md }]}>
                {getMaskedDisplay()}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={() => {
              setShowPassword(!showPassword);
              setTempShowPassword(false);
              if (hidePasswordTimeout.current) {
                clearTimeout(hidePasswordTimeout.current);
              }
            }}
            style={styles.eyeButton}
            disabled={isLoading}
          >
            <Feather
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Forgot Password Link */}
      <TouchableOpacity
        onPress={onForgotPassword}
        style={styles.forgotPasswordButton}
        disabled={isLoading}
      >
        <Text style={[styles.forgotPasswordText, { color: progressColor, fontSize: typography.size.sm }]}>
          {t('emailAuth.login.forgotPassword')}
        </Text>
      </TouchableOpacity>

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
          <Text style={[styles.submitButtonText, { fontSize: typography.size.md }]}>
            {t('emailAuth.login.submit')}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
    paddingVertical: 0,
  },
  passwordInputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  maskedOverlay: {
    position: 'absolute',
    // fontSize set dynamically via theme.typography
    left: 0,
    right: 0,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  errorText: {
    color: '#FF3B30',
    // fontSize set dynamically via theme.typography
    marginLeft: spacing.xs,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
  },
  forgotPasswordText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
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
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default LoginForm;
