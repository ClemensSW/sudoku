// screens/Settings/components/AuthSection/AuthButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useProgressColor } from '@/contexts/color/ColorContext';
import { spacing, radius } from '@/utils/theme';
import GoogleLogo from '@/assets/svg/google-logo.svg';
import AppleLogo from '@/assets/svg/apple-logo.svg';

type AuthProvider = 'google' | 'apple' | 'email';

interface AuthButtonProps {
  provider: AuthProvider;
  onPress: () => void;
  disabled?: boolean;
  label?: string;
  iconOnly?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  provider,
  onPress,
  disabled = false,
  label,
  iconOnly = false,
}) => {
  const theme = useTheme();
  const { colors, typography } = theme;
  const progressColor = useProgressColor();

  const getProviderIcon = () => {
    if (provider === 'google') {
      return <GoogleLogo width={iconOnly ? 24 : 18} height={iconOnly ? 24 : 18} />;
    }
    if (provider === 'apple') {
      return <AppleLogo width={16} height={20} fill={theme.isDark ? '#000000' : '#FFFFFF'} />;
    }
    // Email
    return <Feather name="mail" size={20} color={theme.isDark ? '#FFFFFF' : '#FFFFFF'} />;
  };

  const getButtonStyle = () => {
    if (provider === 'google') {
      return {
        backgroundColor: theme.isDark ? '#FFFFFF' : '#FFFFFF',
        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.12)',
      };
    }
    if (provider === 'apple') {
      return {
        backgroundColor: theme.isDark ? '#FFFFFF' : '#000000',
        borderColor: theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.9)',
      };
    }
    // Email - uses progress color (theme-aware)
    return {
      backgroundColor: progressColor,
      borderColor: progressColor,
      shadowColor: progressColor,
    };
  };

  const getTextStyle = () => {
    if (provider === 'google') {
      return {
        color: '#3C4043',
      };
    }
    if (provider === 'apple') {
      return {
        color: theme.isDark ? '#000000' : '#FFFFFF',
      };
    }
    // Email
    return {
      color: '#FFFFFF',
    };
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        iconOnly && styles.iconOnlyButton,
        getButtonStyle(),
        disabled && styles.disabled,
      ]}
    >
      <View style={[styles.iconContainer, iconOnly && styles.iconOnlyContainer]}>
        {getProviderIcon()}
      </View>
      {!iconOnly && label && (
        <Text style={[styles.label, getTextStyle(), { fontSize: typography.size.md }]}>{label}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconOnlyButton: {
    height: 56,
    gap: 0,
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
  iconOnlyContainer: {
    width: 24,
    height: 24,
  },
  label: {
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default AuthButton;
