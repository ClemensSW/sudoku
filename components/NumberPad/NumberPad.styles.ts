import { StyleSheet } from 'react-native';
import { spacing, typography, radius, shadows } from '@/utils/theme';

export default StyleSheet.create({
  container: {
    width: 324,
    marginTop: spacing.xl,
  },
  
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  
  actionButton: {
    width: spacing.numberPad.buttonSize,
    height: spacing.numberPad.buttonSize,
    borderRadius: spacing.numberPad.buttonBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },
  
  activeActionButton: {
    // Farbe wird dynamisch gesetzt
  },
  
  numbersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  button: {
    width: spacing.numberPad.buttonSize * 1.5,
    height: spacing.numberPad.buttonSize * 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: spacing.numberPad.buttonBorderRadius,
    marginBottom: spacing.numberPad.buttonMargin * 2,
    ...shadows.sm,
  },
  
  disabledButton: {
    opacity: 0.5,
  },
  
  buttonText: {
    ...typography.variant.cellValue,
    fontSize: typography.size.xxl,
    fontWeight: typography.weight.medium,
  },
  
  disabledButtonText: {
    // Farbe wird dynamisch gesetzt
  },
});