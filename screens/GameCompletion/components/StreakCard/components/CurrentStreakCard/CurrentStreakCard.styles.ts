// CurrentStreakCard.styles.ts
import { StyleSheet } from 'react-native';
import { spacing, radius } from '@/utils/theme';

export const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    marginBottom: spacing.lg,
  },

  // Hero Header
  heroHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl * 1.5,
    alignItems: 'center',
  },
  flameContainer: {
    position: 'relative',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flameGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.4,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
    textAlign: 'center',
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: -spacing.xs,
  },
  motivationText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginTop: spacing.md,
  },
  recordText: {
    fontSize: 13,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  recordInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
  },
  recordInfoText: {
    fontSize: 13,
    fontWeight: '600',
  },

  // Calendar Section
  calendarSection: {
    padding: spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  navButton: {
    padding: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  monthTitleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  weekdayText: {
    fontSize: 12,
    fontWeight: '600',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayCircle: {
    flex: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressSection: {
    marginTop: spacing.sm,
  },
  progressBackground: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFillWrapper: {
    height: '100%',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    width: '100%',
    borderRadius: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completedText: {
    fontSize: 11,
    fontWeight: '700',
    color: 'white',
  },
});
