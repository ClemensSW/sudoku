import { StyleSheet } from 'react-native';
import { spacing, typography } from '@/utils/theme';

export default StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: spacing.layout.screenPadding,
  },
  
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  
  title: {
    ...typography.variant.heading3,
  },
  
  subtitle: {
    ...typography.variant.body2,
    marginTop: spacing.xxs,
  },
  
  iconButton: {
    padding: spacing.xs,
  },
});