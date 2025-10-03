/**
 * Shared TypeScript types for GameCompletion screen components
 */
import { Theme } from '@/utils/theme/ThemeProvider';
import { ViewStyle } from 'react-native';

/**
 * Base props that all GameCompletion cards share
 */
export interface CardBaseProps {
  /** Optional additional styles to apply to the card */
  style?: ViewStyle;

  /** Whether animations should be enabled (default: true) */
  animated?: boolean;

  /** Whether to use compact mode (smaller card) */
  compact?: boolean;
}

/**
 * Common card styling theme props
 */
export interface CardThemeProps {
  /** Primary color for the card */
  color: string;

  /** Whether dark mode is active */
  isDark: boolean;

  /** Text colors */
  textPrimaryColor: string;
  textSecondaryColor: string;
}

/**
 * Animation state for cards
 */
export interface CardAnimationState {
  /** Whether the card is currently animating in */
  isAnimatingIn: boolean;

  /** Whether the card is currently animating out */
  isAnimatingOut: boolean;

  /** Whether the card has completed its entry animation */
  hasEnteredComplete: boolean;
}

/**
 * Common callback props for card interactions
 */
export interface CardInteractionProps {
  /** Called when the card is pressed (if pressable) */
  onPress?: () => void;

  /** Called when the card animation completes */
  onAnimationComplete?: () => void;
}
