// screens/Settings/components/AuthSection/AuthButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing, radius } from '@/utils/theme';
import GoogleLogo from '@/assets/svg/google-logo.svg';
import AppleLogo from '@/assets/svg/apple-logo.svg';

type AuthProvider = 'google' | 'apple';

interface AuthButtonProps {
  provider: AuthProvider;
  onPress: () => void;
  disabled?: boolean;
  label: string;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  provider,
  onPress,
  disabled = false,
  label,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  const getProviderIcon = () => {
    if (provider === 'google') {
      return <GoogleLogo width={18} height={18} />;
    }
    return <AppleLogo width={16} height={20} fill={theme.isDark ? '#000000' : '#FFFFFF'} />;
  };

  const getButtonStyle = () => {
    if (provider === 'google') {
      return {
        backgroundColor: theme.isDark ? '#FFFFFF' : '#FFFFFF',
        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
      };
    }
    // Apple
    return {
      backgroundColor: theme.isDark ? '#FFFFFF' : '#000000',
      borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.9)',
    };
  };

  const getTextStyle = () => {
    if (provider === 'google') {
      return {
        color: '#3C4043',
      };
    }
    // Apple
    return {
      color: theme.isDark ? '#000000' : '#FFFFFF',
    };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        getButtonStyle(),
        disabled && styles.disabled,
      ]}
    >
      <View style={styles.iconContainer}>{getProviderIcon()}</View>
      <Text style={[styles.label, getTextStyle()]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: radius.lg,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  disabled: {
    opacity: 0.6,
  },
  iconContainer: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default AuthButton;
