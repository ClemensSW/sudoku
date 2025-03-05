import { StyleSheet } from 'react-native';
import { spacing, typography, radius, shadows } from '@/utils/theme';

export default StyleSheet.create({
  button: {
    height: spacing.button.height,
    minWidth: 120,
    paddingHorizontal: spacing.button.padding,
    borderRadius: spacing.button.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    ...shadows.sm,
  },
  
  buttonText: {
    ...typography.variant.button,
    textAlign: 'center',
  },
});