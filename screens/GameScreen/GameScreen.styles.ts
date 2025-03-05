import { StyleSheet } from 'react-native';
import { spacing } from '@/utils/theme';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: spacing.xl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.layout.screenPadding,
  },
  timerContainer: {
    marginTop: spacing.md,
    alignItems: 'center',
  },
  boardContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
  },
  controlsContainer: {
    marginTop: spacing.lg,
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    marginTop: spacing.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
});