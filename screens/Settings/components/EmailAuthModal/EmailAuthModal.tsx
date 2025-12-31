// screens/Settings/components/EmailAuthModal/EmailAuthModal.tsx
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import BottomSheetModal from '@/components/BottomSheetModal';
import { triggerHaptic } from '@/utils/haptics';
import { signInWithEmail, signUpWithEmail, sendEmailVerification, getEmailAuthErrorKey } from '@/utils/auth/emailAuth';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthMode = 'login' | 'register';

interface EmailAuthModalProps {
  visible: boolean;
  mode: AuthMode;
  onClose: () => void;
  onSuccess: () => void;
}

const EmailAuthModal: React.FC<EmailAuthModalProps> = ({
  visible,
  mode,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation('settings');
  const { colors, isDark } = useTheme();
  const { showAlert } = useAlert();

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastEmail, setLastEmail] = useState<string>('');

  // Load last used email when modal opens
  useEffect(() => {
    if (visible) {
      import('@/utils/storage').then(({ loadLastEmail }) => {
        loadLastEmail().then(email => {
          if (email) setLastEmail(email);
        });
      });
    }
  }, [visible]);

  // Reset state when modal closes
  const handleClose = useCallback(() => {
    setShowForgotPassword(false);
    setIsLoading(false);
    onClose();
  }, [onClose]);

  // Handle login
  const handleLogin = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);

      // Save last used email for next login
      const { saveLastEmail } = await import('@/utils/storage');
      await saveLastEmail(email);

      triggerHaptic('success');

      showAlert({
        title: t('emailAuth.success.loginTitle'),
        message: t('emailAuth.success.loginMessage'),
        type: 'success',
        buttons: [{ text: 'OK', style: 'primary', onPress: () => {} }],
      });

      onSuccess();
      handleClose();
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
  }, [t, showAlert, onSuccess, handleClose]);

  // Handle register
  const handleRegister = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await signUpWithEmail(email, password);

      // Send verification email
      await sendEmailVerification();

      triggerHaptic('success');

      showAlert({
        title: t('emailAuth.success.registerTitle'),
        message: t('emailAuth.success.registerMessageVerify'),
        type: 'success',
        buttons: [{ text: 'OK', style: 'primary', onPress: () => {} }],
      });

      onSuccess();
      handleClose();
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
  }, [t, showAlert, onSuccess, handleClose]);

  // Handle forgot password success
  const handleForgotPasswordSuccess = useCallback(() => {
    setShowForgotPassword(false);
  }, []);

  // Get modal title
  const getTitle = () => {
    if (showForgotPassword) {
      return t('emailAuth.forgotPassword.title');
    }
    return mode === 'login'
      ? t('emailAuth.login.title')
      : t('emailAuth.register.title');
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      title={getTitle()}
      isDark={isDark}
      textPrimaryColor={colors.textPrimary}
      surfaceColor={colors.surface}
      borderColor={colors.border}
      snapPoints={['100%']}
      managesBottomNav={false}
      keyboardBehavior="fillParent"
      android_keyboardInputMode="adjustResize"
    >
      <View style={styles.container}>
        {/* Forgot Password View */}
        {showForgotPassword && (
          <ForgotPasswordForm
            onSuccess={handleForgotPasswordSuccess}
            onBack={() => setShowForgotPassword(false)}
            onShowAlert={showAlert}
          />
        )}

        {/* Login Form */}
        {!showForgotPassword && mode === 'login' && (
          <LoginForm
            onSubmit={handleLogin}
            onForgotPassword={() => setShowForgotPassword(true)}
            isLoading={isLoading}
            initialEmail={lastEmail}
          />
        )}

        {/* Register Form */}
        {!showForgotPassword && mode === 'register' && (
          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isLoading}
          />
        )}
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EmailAuthModal;
