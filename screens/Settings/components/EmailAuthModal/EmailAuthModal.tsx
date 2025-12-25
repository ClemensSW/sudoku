// screens/Settings/components/EmailAuthModal/EmailAuthModal.tsx
import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/contexts/color/ColorContext';
import { useAlert } from '@/components/CustomAlert/AlertProvider';
import BottomSheetModal from '@/components/BottomSheetModal';
import { spacing, radius } from '@/utils/theme';
import { triggerHaptic } from '@/utils/haptics';
import { signInWithEmail, signUpWithEmail, getEmailAuthErrorKey } from '@/utils/auth/emailAuth';

import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import ForgotPasswordForm from './ForgotPasswordForm';

type AuthView = 'login' | 'register' | 'forgotPassword';

interface EmailAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EmailAuthModal: React.FC<EmailAuthModalProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const { t } = useTranslation('settings');
  const { colors, isDark } = useTheme();
  const progressColor = useProgressColor();
  const { showAlert } = useAlert();

  const [activeView, setActiveView] = useState<AuthView>('login');
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

  // Reset view when modal closes
  const handleClose = useCallback(() => {
    setActiveView('login');
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
      triggerHaptic('success');

      showAlert({
        title: t('emailAuth.success.registerTitle'),
        message: t('emailAuth.success.registerMessage'),
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
    setActiveView('login');
  }, []);

  // Render tab buttons
  const renderTabs = () => {
    if (activeView === 'forgotPassword') return null;

    return (
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tab,
            activeView === 'login' && styles.activeTab,
            { borderColor: activeView === 'login' ? progressColor : 'transparent' },
          ]}
          onPress={() => {
            triggerHaptic('light');
            setActiveView('login');
          }}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeView === 'login' ? progressColor : colors.textSecondary },
            ]}
          >
            {t('emailAuth.tabs.login')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            activeView === 'register' && styles.activeTab,
            { borderColor: activeView === 'register' ? progressColor : 'transparent' },
          ]}
          onPress={() => {
            triggerHaptic('light');
            setActiveView('register');
          }}
          disabled={isLoading}
        >
          <Text
            style={[
              styles.tabText,
              { color: activeView === 'register' ? progressColor : colors.textSecondary },
            ]}
          >
            {t('emailAuth.tabs.register')}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Get modal title based on current view
  const getTitle = () => {
    switch (activeView) {
      case 'login':
        return t('emailAuth.login.title');
      case 'register':
        return t('emailAuth.register.title');
      case 'forgotPassword':
        return t('emailAuth.forgotPassword.title');
      default:
        return '';
    }
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
      snapPoints={['85%']}
      managesBottomNav={false}
      keyboardBehavior="fillParent"
      android_keyboardInputMode="adjustResize"
    >
      <View style={styles.container}>
        {renderTabs()}

        <View style={styles.formContainer}>
          {activeView === 'login' && (
            <LoginForm
              onSubmit={handleLogin}
              onForgotPassword={() => setActiveView('forgotPassword')}
              isLoading={isLoading}
              initialEmail={lastEmail}
            />
          )}

          {activeView === 'register' && (
            <RegisterForm
              onSubmit={handleRegister}
              isLoading={isLoading}
            />
          )}

          {activeView === 'forgotPassword' && (
            <ForgotPasswordForm
              onSuccess={handleForgotPasswordSuccess}
              onBack={() => setActiveView('login')}
            />
          )}
        </View>
      </View>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
  },
  activeTab: {
    // Border color set dynamically
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    flex: 1,
  },
});

export default EmailAuthModal;
