// screens/Leistung/components/AchievementsTab/AchievementsTab.styles.ts
import { StyleSheet } from 'react-native';
import { spacing, radius } from '@/utils/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
});

export const heroStyles = StyleSheet.create({
  // Hero Card Container
  card: {
    width: '100%',
    borderRadius: radius.xl,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },

  // Hero Header with Gradient
  heroHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl * 1.5,
    alignItems: 'center',
  },

  // Icon Container
  iconContainer: {
    position: 'relative',
    marginTop: spacing.lg,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.4,
  },

  // Main Number
  mainNumber: {
    fontSize: 64,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
    letterSpacing: -2,
    textAlign: 'center',
  },
  mainLabel: {
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: -spacing.xs,
  },

  // Separator Line
  separator: {
    width: 60,
    height: 2,
    borderRadius: 1,
    marginVertical: spacing.lg,
  },

  // Secondary Stats Row
  secondaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
  winRateText: {
    fontSize: 18,
    fontWeight: '800',
  },
  dotSeparator: {
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.5,
  },

  // Motivation Section
  motivationContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  motivationEmoji: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  motivationText: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export const difficultyStyles = StyleSheet.create({
  // Card Container
  card: {
    borderRadius: radius.xl,
    borderWidth: 1,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  // Section Title
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },

  // Difficulty Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rowLast: {
    marginBottom: 0,
  },

  // Difficulty Label
  difficultyLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: '600',
  },

  // Progress Bar
  progressBarContainer: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },

  // Count Text
  countText: {
    width: 40,
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});

// StatsSection Styles (embedded in GamesHero, like calendar in StreakCard)
export const statsSectionStyles = StyleSheet.create({
  // Container - no card, just padding like calendarSection in Serie
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },

  // Tab Row
  tabRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    letterSpacing: 0.3,
  },

  // Stats Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  rowLast: {
    marginBottom: 0,
  },

  // Difficulty Label
  difficultyLabel: {
    width: 70,
    fontSize: 14,
    fontWeight: '600',
  },

  // Progress Bar
  progressBarContainer: {
    flex: 1,
    marginHorizontal: spacing.sm,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },

  // Value Text (wider for time format)
  valueText: {
    width: 50,
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
  },
});
