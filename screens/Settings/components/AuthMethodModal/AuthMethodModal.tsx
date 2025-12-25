// screens/Settings/components/AuthMethodModal/AuthMethodModal.tsx
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/contexts/color/ColorContext';
import { spacing, radius } from '@/utils/theme';
import { triggerHaptic } from '@/utils/haptics';
import BottomSheetModal from '@/components/BottomSheetModal';
import AuthButton from '../AuthSection/AuthButton';

type AuthMode = 'login' | 'register';

interface AuthMethodModalProps {
  visible: boolean;
  mode: AuthMode;
  onClose: () => void;
  onEmailPress: () => void;
  onGooglePress: () => void;
  onApplePress?: () => void;
  onOpenLegal: (docType: 'datenschutz' | 'agb') => void;
}

const AuthMethodModal: React.FC<AuthMethodModalProps> = ({
  visible,
  mode,
  onClose,
  onEmailPress,
  onGooglePress,
  onApplePress,
  onOpenLegal,
}) => {
  const { t } = useTranslation('settings');
  const { colors, isDark } = useTheme();
  const progressColor = useProgressColor();

  const showGoogleButton = Platform.OS === 'android';
  const showAppleButton = Platform.OS === 'ios';
  const isRegister = mode === 'register';

  const handleEmailPress = () => {
    triggerHaptic('light');
    onEmailPress();
  };

  const handleGooglePress = () => {
    triggerHaptic('light');
    onGooglePress();
  };

  const handleApplePress = () => {
    triggerHaptic('light');
    onApplePress?.();
  };

  const title = isRegister
    ? t('authMethodModal.createAccount')
    : t('authMethodModal.signIn');

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      title={title}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['50%']}
      managesBottomNav={false}
    >
      <View style={styles.container}>
        {/* Auth Buttons */}
        <View style={styles.buttonsContainer}>
          {/* Google Button */}
          {showGoogleButton && (
            <AuthButton
              provider="google"
              label={t('authMethodModal.continueWithGoogle')}
              onPress={handleGooglePress}
              disabled={false}
            />
          )}

          {/* Apple Button */}
          {showAppleButton && (
            <AuthButton
              provider="apple"
              label={t('authMethodModal.continueWithApple')}
              onPress={handleApplePress}
              disabled={true} // Not implemented yet
            />
          )}

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>
              {t('authMethodModal.or')}
            </Text>
            <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
          </View>

          {/* Email Button */}
          <AuthButton
            provider="email"
            label={t('authMethodModal.continueWithEmail')}
            onPress={handleEmailPress}
            disabled={false}
          />
        </View>

        {/* Legal Text - Only for Register */}
        {isRegister && (
          <Text style={[styles.legalText, { color: colors.textSecondary }]}>
            {t('authMethodModal.legalPrefix')}
            <Text
              style={[styles.legalLink, { color: progressColor }]}
              onPress={() => onOpenLegal('datenschutz')}
            >
              {t('authMethodModal.privacy')}
            </Text>
            {t('authMethodModal.legalAnd')}
            <Text
              style={[styles.legalLink, { color: progressColor }]}
              onPress={() => onOpenLegal('agb')}
            >
              {t('authMethodModal.terms')}
            </Text>
            {t('authMethodModal.legalSuffix')}
          </Text>
        )}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacing.xl,
    marginBottom: spacing.xxl * 2,
  },
  buttonsContainer: {
    gap: spacing.md,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  legalText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.md,
  },
  legalLink: {
    fontWeight: '600',
  },
});

export default AuthMethodModal;
