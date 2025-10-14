// StreakCalendarDebug.tsx
// 🚨 DEBUG ONLY - Remove before production build
// This component provides mock data for testing different calendar scenarios in Expo Go

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { MonthlyPlayData } from '@/utils/storage';
import Constants from 'expo-constants';

interface DebugScenario {
  name: string;
  description: string;
  currentStreak: number;
  longestStreak: number;
  shieldsAvailable: number;
  playHistory: { [yearMonth: string]: MonthlyPlayData };
  firstLaunchDate: string;
}

const getCurrentYearMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
};

const getCurrentDay = () => new Date().getDate();

const getFirstDayOfMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-01`;
};

const DEBUG_SCENARIOS: DebugScenario[] = [
  {
    name: 'Streak aktiv (heute gespielt)',
    description: 'Streak=7, alle Tage bis gestern gespielt, heute schon gespielt',
    currentStreak: 7,
    longestStreak: 10,
    shieldsAvailable: 2,
    firstLaunchDate: getFirstDayOfMonth(),
    playHistory: {
      [getCurrentYearMonth()]: {
        days: Array.from({ length: getCurrentDay() }, (_, i) => i + 1),
        shieldDays: [],
        completed: false,
        reward: null,
      },
    },
  },
  {
    name: 'Streak-Break gestern',
    description: 'Streak=0, Tag 1-5 gespielt, Tag 6 = Streak-Break, Tag 7+ = inactive',
    currentStreak: 0,
    longestStreak: 10,
    shieldsAvailable: 2,
    firstLaunchDate: getFirstDayOfMonth(),
    playHistory: {
      [getCurrentYearMonth()]: {
        days: [1, 2, 3, 4, 5],
        shieldDays: [],
        completed: false,
        reward: null,
      },
    },
  },
  {
    name: 'Shield eingesetzt am 10.',
    description: 'Streak aktiv, Tag 10 mit Shield geschützt',
    currentStreak: getCurrentDay() - 1,
    longestStreak: 15,
    shieldsAvailable: 1,
    firstLaunchDate: getFirstDayOfMonth(),
    playHistory: {
      [getCurrentYearMonth()]: {
        days: Array.from({ length: getCurrentDay() - 1 }, (_, i) => i + 1),
        shieldDays: [10],
        completed: false,
        reward: null,
      },
    },
  },
  {
    name: 'Streak-Break + Shield am 12.',
    description: 'Tag 1-9 gespielt, Tag 10 Shield, Tag 11 gespielt, Tag 12 = Break, Tag 13+ = inactive',
    currentStreak: 0,
    longestStreak: 15,
    shieldsAvailable: 1,
    firstLaunchDate: getFirstDayOfMonth(),
    playHistory: {
      [getCurrentYearMonth()]: {
        days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        shieldDays: [10],
        completed: false,
        reward: null,
      },
    },
  },
  {
    name: 'Monat nie gestartet',
    description: 'Streak=0, keine Tage gespielt, alle Tage = inactive',
    currentStreak: 0,
    longestStreak: 5,
    shieldsAvailable: 2,
    firstLaunchDate: getFirstDayOfMonth(),
    playHistory: {
      [getCurrentYearMonth()]: {
        days: [],
        shieldDays: [],
        completed: false,
        reward: null,
      },
    },
  },
  {
    name: 'Mehrere Streak-Breaks',
    description: 'Komplexes Szenario: Tag 1-3 gespielt, Break am 4, Tag 5-7 gespielt, Break am 8',
    currentStreak: 0,
    longestStreak: 8,
    shieldsAvailable: 0,
    firstLaunchDate: getFirstDayOfMonth(),
    playHistory: {
      [getCurrentYearMonth()]: {
        days: [1, 2, 3, 5, 6, 7],
        shieldDays: [],
        completed: false,
        reward: null,
      },
    },
  },
  {
    name: 'Heute noch nicht gespielt',
    description: 'Streak=7, bis gestern gespielt, heute noch offen',
    currentStreak: 7,
    longestStreak: 10,
    shieldsAvailable: 2,
    firstLaunchDate: getFirstDayOfMonth(),
    playHistory: {
      [getCurrentYearMonth()]: {
        days: Array.from({ length: getCurrentDay() - 1 }, (_, i) => i + 1),
        shieldDays: [],
        completed: false,
        reward: null,
      },
    },
  },
  {
    name: 'Fast vollständig',
    description: 'Monat fast komplett, nur 2 Tage fehlen (Tag 5 mit Shield)',
    currentStreak: 25,
    longestStreak: 25,
    shieldsAvailable: 1,
    firstLaunchDate: getFirstDayOfMonth(),
    playHistory: {
      [getCurrentYearMonth()]: {
        days: Array.from({ length: getCurrentDay() - 1 }, (_, i) => i + 1).filter(d => d !== 5 && d !== 12),
        shieldDays: [5],
        completed: false,
        reward: null,
      },
    },
  },
];

interface StreakCalendarDebugProps {
  onScenarioSelect: (scenario: DebugScenario) => void;
  onReset: () => void;
}

const StreakCalendarDebug: React.FC<StreakCalendarDebugProps> = ({
  onScenarioSelect,
  onReset,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  // Only show in Expo Go (development)
  const isExpoGo = Constants.appOwnership === 'expo';
  if (!isExpoGo && !__DEV__) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: '#FF6B6B' }]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text style={[styles.headerText, { color: '#FF6B6B' }]}>
          🐛 DEBUG KALENDER
        </Text>
        <Text style={[styles.headerSubtext, { color: colors.textSecondary }]}>
          {isExpanded ? 'Ausblenden' : 'Szenarien testen'}
        </Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.scenariosContainer}>
          {DEBUG_SCENARIOS.map((scenario, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.scenarioButton,
                {
                  backgroundColor: selectedScenario === scenario.name
                    ? 'rgba(255, 107, 107, 0.2)'
                    : 'transparent',
                  borderColor: colors.border,
                },
              ]}
              onPress={() => {
                setSelectedScenario(scenario.name);
                onScenarioSelect(scenario);
              }}
            >
              <Text style={[styles.scenarioName, { color: colors.textPrimary }]}>
                {scenario.name}
              </Text>
              <Text style={[styles.scenarioDescription, { color: colors.textSecondary }]}>
                {scenario.description}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.resetButton, { backgroundColor: '#FF6B6B' }]}
            onPress={() => {
              setSelectedScenario(null);
              onReset();
            }}
          >
            <Text style={styles.resetButtonText}>
              ↻ Echte Daten wiederherstellen
            </Text>
          </TouchableOpacity>

          <Text style={[styles.removeHint, { color: colors.textSecondary }]}>
            💡 Zum Entfernen: Suche nach "StreakCalendarDebug" und lösche alle Referenzen
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerSubtext: {
    fontSize: 12,
    marginTop: 4,
  },
  scenariosContainer: {
    padding: 12,
    gap: 8,
  },
  scenarioButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  scenarioName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  scenarioDescription: {
    fontSize: 12,
  },
  resetButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  removeHint: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default StreakCalendarDebug;
