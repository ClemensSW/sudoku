// screens/Leistung/components/StreakTab/StreakDevTool.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { Feather } from '@expo/vector-icons';
import { spacing, radius } from '@/utils/theme';

export interface MockStreakData {
  currentStreak: number;
  longestStreak: number;
  shieldsAvailable: number;
  maxRegularShields: 2 | 3 | 4;
  bonusShields: number;
  supporterStatus: 'none' | 'one-time' | 'subscription';
}

interface StreakDevToolProps {
  currentMock: MockStreakData | null;
  onSimulate: (mockData: MockStreakData) => void;
  onReset: () => void;
}

// Preset values for quick selection
const STREAK_PRESETS = [0, 1, 7, 30, 100, 365];
const SHIELD_PRESETS: { available: number; max: 2 | 3 | 4; label: string }[] = [
  { available: 0, max: 2, label: '0/2' },
  { available: 2, max: 2, label: '2/2' },
  { available: 0, max: 3, label: '0/3' },
  { available: 3, max: 3, label: '3/3' },
  { available: 0, max: 4, label: '0/4' },
  { available: 4, max: 4, label: '4/4' },
];
const BONUS_PRESETS = [0, 1, 2, 5];
const STATUS_PRESETS: { value: 'none' | 'one-time' | 'subscription'; label: string }[] = [
  { value: 'none', label: 'Free' },
  { value: 'one-time', label: 'Einmal' },
  { value: 'subscription', label: 'Abo' },
];

const StreakDevTool: React.FC<StreakDevToolProps> = ({
  currentMock,
  onSimulate,
  onReset,
}) => {
  const theme = useTheme();
  const { colors, isDark, typography } = theme;

  // Default mock state
  const defaultMock: MockStreakData = {
    currentStreak: 7,
    longestStreak: 30,
    shieldsAvailable: 2,
    maxRegularShields: 2,
    bonusShields: 0,
    supporterStatus: 'none',
  };

  const mock = currentMock || defaultMock;

  const updateMock = (partial: Partial<MockStreakData>) => {
    onSimulate({
      ...mock,
      ...partial,
      // Ensure longestStreak is at least currentStreak
      longestStreak: Math.max(
        partial.longestStreak ?? mock.longestStreak,
        partial.currentStreak ?? mock.currentStreak
      ),
    });
  };

  const isActive = currentMock !== null;

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#1E1E1E' : '#F5F5F5' }
    ]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Feather name="tool" size={18} color={colors.primary} />
          <Text style={[styles.title, { color: colors.textPrimary, fontSize: typography.size.md }]}>
            Streak DevTool
          </Text>
          {isActive && (
            <View style={[styles.activeBadge, { backgroundColor: colors.primary + '30' }]}>
              <Text style={[styles.activeBadgeText, { color: colors.primary, fontSize: typography.size.xs }]}>
                AKTIV
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Streak Presets */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
          Streak
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {STREAK_PRESETS.map((value) => (
            <Chip
              key={`streak-${value}`}
              label={String(value)}
              isSelected={mock.currentStreak === value}
              onPress={() => updateMock({ currentStreak: value })}
              colors={colors}
              typography={typography}
            />
          ))}
        </ScrollView>
      </View>

      {/* Shield Presets */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
          Schilde (verfügbar/max)
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {SHIELD_PRESETS.map((preset) => (
            <Chip
              key={`shield-${preset.label}`}
              label={preset.label}
              isSelected={mock.shieldsAvailable === preset.available && mock.maxRegularShields === preset.max}
              onPress={() => updateMock({
                shieldsAvailable: preset.available,
                maxRegularShields: preset.max,
              })}
              colors={colors}
              typography={typography}
            />
          ))}
        </ScrollView>
      </View>

      {/* Bonus Shield Presets */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
          Bonus-Schilde
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {BONUS_PRESETS.map((value) => (
            <Chip
              key={`bonus-${value}`}
              label={String(value)}
              isSelected={mock.bonusShields === value}
              onPress={() => updateMock({ bonusShields: value })}
              colors={colors}
              typography={typography}
            />
          ))}
        </ScrollView>
      </View>

      {/* Supporter Status Presets */}
      <View style={styles.section}>
        <Text style={[styles.sectionLabel, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
          Supporter-Status
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          {STATUS_PRESETS.map((preset) => (
            <Chip
              key={`status-${preset.value}`}
              label={preset.label}
              isSelected={mock.supporterStatus === preset.value}
              onPress={() => updateMock({ supporterStatus: preset.value })}
              colors={colors}
              typography={typography}
            />
          ))}
        </ScrollView>
      </View>

      {/* Reset Button */}
      <TouchableOpacity
        style={[
          styles.resetButton,
          {
            backgroundColor: isActive ? '#ff444420' : (isDark ? '#2A2A2E' : '#E0E0E0'),
            borderColor: isActive ? '#ff4444' : 'transparent',
          }
        ]}
        onPress={onReset}
      >
        <Feather
          name="refresh-cw"
          size={16}
          color={isActive ? '#ff4444' : colors.textSecondary}
        />
        <Text style={[
          styles.resetButtonText,
          {
            color: isActive ? '#ff4444' : colors.textSecondary,
            fontSize: typography.size.sm,
          }
        ]}>
          {isActive ? 'Mock deaktivieren' : 'Echte Daten anzeigen'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

// Chip component for selection
interface ChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  colors: any;
  typography: any;
}

const Chip: React.FC<ChipProps> = ({ label, isSelected, onPress, colors, typography }) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        {
          backgroundColor: isSelected ? colors.primary : colors.surface,
          borderColor: isSelected ? colors.primary : 'rgba(128,128,128,0.3)',
        }
      ]}
      onPress={onPress}
    >
      <Text style={[
        styles.chipText,
        {
          color: isSelected ? '#FFFFFF' : colors.textSecondary,
          fontSize: typography.size.sm,
        }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
  },
  header: {
    marginBottom: spacing.md,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontWeight: '700',
  },
  activeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginLeft: spacing.sm,
  },
  activeBadgeText: {
    fontWeight: '700',
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontWeight: '600',
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: 'row',
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  chipText: {
    fontWeight: '600',
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginTop: spacing.sm,
  },
  resetButtonText: {
    fontWeight: '600',
  },
});

export default StreakDevTool;
