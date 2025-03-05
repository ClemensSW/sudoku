import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/utils/theme';

export default StyleSheet.create({
  container: {
    marginVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    ...typography.variant.heading3,
    fontVariant: ['tabular-nums'], // Monospace für gleichmäßige Zahlen
  },
});