// screens/Settings/components/EmailAuthModal/RegisterForm.tsx
import React, { useState, useRef, useEffect } from 'react';
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
import { isValidEmail, isValidPassword } from '@/utils/auth/emailAuth';

interface RegisterFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}

// Password strength helper
type PasswordStrength = 'weak' | 'medium' | 'strong';

const getPasswordStrength = (password: string): PasswordStrength => {
  if (password.length < 6) return 'weak';
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  if (password.length >= 8 && hasNumber && hasSpecial) return 'strong';
  if (password.length >= 6) return 'medium';
  return 'weak';
};

const getStrengthColor = (strength: PasswordStrength): string => {
  switch (strength) {
    case 'weak': return '#FF3B30';
    case 'medium': return '#FF9500';
    case 'strong': return '#34C759';
  }
};

const getStrengthWidth = (strength: PasswordStrength): `${number}%` => {
  switch (strength) {
    case 'weak': return '33%';
    case 'medium': return '66%';
    case 'strong': return '100%';
  }
};

const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const { t } = useTranslation('settings');
  const { colors, isDark } = useTheme();
  const progressColor = useProgressColor();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [tempShowPassword, setTempShowPassword] = useState(false);
  const hidePasswordTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const passwordStrength = getPasswordStrength(password);

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

  // Handle password change with temporary reveal of last char
  const handlePasswordChange = (text: string) => {
    // Clear any existing timeout
    if (hidePasswordTimeout.current) {
      clearTimeout(hidePasswordTimeout.current);
    }

    const isAdding = text.length > password.length;
    setPassword(text);
    if (passwordError) setPasswordError('');

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
    let hasError = false;

    // Validate email
    if (!isValidEmail(email)) {
      setEmailError(t('emailAuth.errors.invalidEmail'));
      hasError = true;
    } else {
      setEmailError('');
    }

    // Validate password
    if (!isValidPassword(password)) {
      setPasswordError(t('emailAuth.errors.weakPassword'));
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) return;

    await onSubmit(email, password);
  };

  const isFormValid = email.length > 0 && password.length >= 6;

  return (
    <View style={styles.container}>
      {/* Email Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('emailAuth.register.email')}
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
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder={t('emailAuth.register.emailPlaceholder')}
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

      {/* Password Input */}
      <View style={styles.inputGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {t('emailAuth.register.password')}
        </Text>
        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)',
              borderColor: passwordError ? '#FF3B30' : colors.border,
            },
          ]}
        >
          <Feather name="lock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
          <View style={styles.passwordInputWrapper}>
            <BottomSheetTextInput
              style={[
                styles.input,
                { color: tempShowPassword && !showPassword ? 'transparent' : colors.textPrimary }
              ]}
              placeholder={t('emailAuth.register.passwordPlaceholder')}
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={handlePasswordChange}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            {tempShowPassword && !showPassword && password.length > 0 && (
              <Text style={[styles.maskedOverlay, { color: colors.textPrimary }]}>
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
        {/* Password Strength Indicator */}
        {password.length > 0 && (
          <View style={styles.strengthContainer}>
            <View style={styles.strengthBarBackground}>
              <View
                style={[
                  styles.strengthBar,
                  {
                    width: getStrengthWidth(passwordStrength),
                    backgroundColor: getStrengthColor(passwordStrength),
                  },
                ]}
              />
            </View>
            <Text style={[styles.strengthText, { color: getStrengthColor(passwordStrength) }]}>
              {t(`emailAuth.register.strength.${passwordStrength}`)}
            </Text>
          </View>
        )}
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
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
            {t('emailAuth.register.submit')}
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
  passwordInputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  maskedOverlay: {
    position: 'absolute',
    fontSize: 16,
    left: 0,
    right: 0,
  },
  eyeButton: {
    padding: spacing.xs,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  strengthBarBackground: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 50,
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
});

export default RegisterForm;
