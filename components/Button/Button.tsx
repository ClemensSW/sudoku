import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '@/utils/theme';
import styles from './Button.styles';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'danger' | 'success';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Dynamische Styles basierend auf Variant und Status
  const getButtonStyle = () => {
    const buttonStyles = [styles.button];
    
    // Variant-spezifische Styles
    switch (variant) {
      case 'primary':
        buttonStyles.push({ backgroundColor: colors.primary });
        break;
      case 'secondary':
        buttonStyles.push({ backgroundColor: colors.surface });
        break;
      case 'outline':
        buttonStyles.push({ 
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: colors.primary,
        });
        break;
      case 'danger':
        buttonStyles.push({ backgroundColor: colors.error });
        break;
      case 'success':
        buttonStyles.push({ backgroundColor: colors.success });
        break;
      default:
        buttonStyles.push({ backgroundColor: colors.primary });
    }
    
    // Status-spezifische Styles
    if (disabled) {
      buttonStyles.push({ 
        backgroundColor: colors.buttonDisabled,
        borderColor: colors.buttonDisabled,
      });
    }
    
    // Benutzerdefinierte Styles
    if (style) {
      buttonStyles.push(style);
    }
    
    return buttonStyles;
  };
  
  // Dynamische Text-Styles
  const getTextStyle = () => {
    const textStyles = [styles.buttonText];
    
    switch (variant) {
      case 'primary':
      case 'danger':
      case 'success':
        textStyles.push({ color: colors.buttonText });
        break;
      case 'secondary':
        textStyles.push({ color: colors.textPrimary });
        break;
      case 'outline':
        textStyles.push({ color: colors.primary });
        break;
      default:
        textStyles.push({ color: colors.buttonText });
    }
    
    if (disabled) {
      textStyles.push({ color: colors.buttonTextDisabled });
    }
    
    if (textStyle) {
      textStyles.push(textStyle);
    }
    
    return textStyles;
  };
  
  // Kombiniere alle Styles
  const buttonStyles = getButtonStyle();
  const titleStyles = getTextStyle();

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? colors.primary : colors.buttonText} 
          size="small" 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={titleStyles}>{title}</Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  );
};

export default Button;