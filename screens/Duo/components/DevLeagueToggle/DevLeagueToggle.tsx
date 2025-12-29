/**
 * DevLeagueToggle - Dev-Button zum Testen verschiedener Ligen
 *
 * Zeigt nur im __DEV__ Modus an.
 * Ermöglicht das Durchschalten aller 7 Ligen.
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useDevLeague, LEAGUE_ORDER } from '@/contexts/DevLeagueContext';
import { getLeagueColors } from '@/utils/elo/leagueColors';
import { getRankTierName } from '@/utils/elo/eloCalculator';

interface DevLeagueToggleProps {
  showDevBanner?: boolean;
  onToggleDevBanner?: () => void;
}

const DevLeagueToggle: React.FC<DevLeagueToggleProps> = ({
  showDevBanner = true,
  onToggleDevBanner,
}) => {
  // Nur im DEV-Modus anzeigen
  if (!__DEV__) return null;

  const { colors, typography, isDark } = useTheme();
  const devLeague = useDevLeague();

  // Wenn kein Provider vorhanden
  if (!devLeague) return null;

  const { overrideLeague, cycleLeague, resetLeague } = devLeague;
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
          {LEAGUE_ORDER.map((tier, index) => {
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

        {/* Banner Toggle */}
        {onToggleDevBanner && (
          <Pressable
            onPress={onToggleDevBanner}
            style={({ pressed }) => [
              styles.bannerToggle,
              {
                backgroundColor: showDevBanner
                  ? isDark
                    ? 'rgba(46,107,123,0.3)'
                    : 'rgba(46,107,123,0.15)'
                  : isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.05)',
                borderColor: showDevBanner
                  ? 'rgba(46,107,123,0.5)'
                  : isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.08)',
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <Feather
              name={showDevBanner ? 'eye' : 'eye-off'}
              size={14}
              color={showDevBanner ? '#2E6B7B' : colors.textSecondary}
            />
            <Text
              style={[
                styles.bannerToggleText,
                { color: showDevBanner ? '#2E6B7B' : colors.textSecondary, fontSize: typography.size.sm },
              ]}
            >
              {showDevBanner ? 'Banner sichtbar' : 'Banner versteckt'}
            </Text>
          </Pressable>
        )}
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
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
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
  bannerToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  bannerToggleText: {
    // fontSize set dynamically via theme.typography
    fontWeight: '500',
  },
});

export default DevLeagueToggle;
