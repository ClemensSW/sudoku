/**
 * DevLeagueToggle - Dev-Button zum Testen verschiedener Ligen
 *
 * Zeigt nur im __DEV__ Modus an.
 * Ermöglicht das Durchschalten aller 7 Ligen und Online Features.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useDevLeague, LEAGUE_ORDER } from '@/contexts/DevLeagueContext';
import { getLeagueColors } from '@/utils/elo/leagueColors';
import { getRankTierName } from '@/utils/elo/eloCalculator';

const DevLeagueToggle: React.FC = () => {
  // Nur im DEV-Modus anzeigen
  if (!__DEV__) return null;

  const { colors, typography, isDark } = useTheme();
  const devLeague = useDevLeague();

  // Wenn kein Provider vorhanden
  if (!devLeague) return null;

  const { overrideLeague, cycleLeague, resetLeague, onlineFeaturesEnabled, toggleOnlineFeatures } = devLeague;
  const leagueColors = overrideLeague ? getLeagueColors(overrideLeague, isDark) : null;
  const currentIndex = overrideLeague ? LEAGUE_ORDER.indexOf(overrideLeague) : -1;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.05)'
              : 'rgba(0,0,0,0.03)',
            borderColor: isDark
              ? 'rgba(255,255,255,0.1)'
              : 'rgba(0,0,0,0.06)',
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Feather
            name="code"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={[styles.headerText, { color: colors.textSecondary, fontSize: typography.size.xs }]}>
            DEV: Liga-Test
          </Text>
        </View>

        {/* Liga-Anzeige */}
        <View style={styles.content}>
          <Pressable
            onPress={cycleLeague}
            style={({ pressed }) => [
              styles.leagueButton,
              {
                backgroundColor: leagueColors?.accent || colors.textSecondary,
                opacity: pressed ? 0.8 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <Feather name="refresh-cw" size={16} color="#FFFFFF" />
            <Text style={[styles.leagueText, { fontSize: typography.size.md }]}>
              {overrideLeague
                ? `${getRankTierName(overrideLeague)} (${currentIndex + 1}/7)`
                : 'Starten'}
            </Text>
          </Pressable>

          {/* Reset Button */}
          {overrideLeague && (
            <Pressable
              onPress={resetLeague}
              style={({ pressed }) => [
                styles.resetButton,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather name="x" size={16} color={colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {/* Liga-Dots */}
        <View style={styles.dotsContainer}>
          {LEAGUE_ORDER.map((tier) => {
            const tierColors = getLeagueColors(tier, isDark);
            const isActive = tier === overrideLeague;
            return (
              <View
                key={tier}
                style={[
                  styles.dot,
                  {
                    backgroundColor: isActive
                      ? tierColors.accent
                      : isDark
                        ? 'rgba(255,255,255,0.2)'
                        : 'rgba(0,0,0,0.1)',
                    transform: [{ scale: isActive ? 1.3 : 1 }],
                  },
                ]}
              />
            );
          })}
        </View>

        {/* Online Features Toggle */}
        <Pressable
          onPress={toggleOnlineFeatures}
          style={({ pressed }) => [
            styles.onlineToggle,
            {
              backgroundColor: onlineFeaturesEnabled
                ? isDark
                  ? 'rgba(76,175,80,0.3)'
                  : 'rgba(76,175,80,0.15)'
                : isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.05)',
              borderColor: onlineFeaturesEnabled
                ? 'rgba(76,175,80,0.5)'
                : isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.08)',
              opacity: pressed ? 0.7 : 1,
            },
          ]}
        >
          <Feather
            name="globe"
            size={14}
            color={onlineFeaturesEnabled ? '#4CAF50' : colors.textSecondary}
          />
          <Text
            style={[
              styles.onlineToggleText,
              { color: onlineFeaturesEnabled ? '#4CAF50' : colors.textSecondary, fontSize: typography.size.sm },
            ]}
          >
            {onlineFeaturesEnabled ? 'Online Features AN' : 'Online Features AUS'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  headerText: {
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leagueButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  leagueText: {
    fontWeight: '600',
    color: '#FFFFFF',
  },
  resetButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
  onlineToggleText: {
    fontWeight: '600',
  },
});

export default DevLeagueToggle;
