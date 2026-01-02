// screens/Leistung/components/StreakTab/StreakTab.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { GameStats } from '@/utils/storage';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing } from '@/utils/theme';
import { getNextMonday } from '@/utils/dailyStreak';
import { getSupporterStatus } from '@/modules/subscriptions/entitlements';

// Import components from GameCompletion/StreakCard
import {
  CurrentStreakCard,
  ShieldIndicator,
  StreakStats,
} from '@/screens/GameCompletion/components/StreakCard/components';

// Dev tool for visual testing
import StreakDevTool, { MockStreakData } from './StreakDevTool';

interface StreakTabProps {
  stats: GameStats;
  onOpenSupportShop?: () => void;
}

const StreakTab: React.FC<StreakTabProps> = ({ stats, onOpenSupportShop }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const isFocused = useIsFocused();

  // State
  const [isPremium, setIsPremium] = useState(false);
  const [maxRegularShields, setMaxRegularShields] = useState<2 | 3 | 4>(2);
  const [supporterStatus, setSupporterStatus] = useState<'none' | 'one-time' | 'subscription'>('none');

  // Dev tool mock state (only used in DEV)
  const [mockData, setMockData] = useState<MockStreakData | null>(null);

  // Check premium status for shield count
  // Aktualisiert sich bei jedem Screen-Focus (z.B. nach Kauf im SupportShop)
  useEffect(() => {
    if (!isFocused) return;

    let cancelled = false;

    (async () => {
      try {
        const status = await getSupporterStatus();
        if (cancelled) return;

        setIsPremium(status.isPremiumSubscriber);
        setSupporterStatus(status.supportType || 'none');

        // Dynamische Shield-Berechnung: Yearly=4, Monthly=3, Free=2
        const { getMaxWeeklyShields } = await import('@/modules/subscriptions/entitlements');
        const maxShields = await getMaxWeeklyShields(status);
        if (cancelled) return;

        setMaxRegularShields(maxShields);
      } catch (error) {
        console.error('[StreakTab] Error checking premium status:', error);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [stats, isFocused]);

  // Safety check: dailyStreak must exist
  if (!stats.dailyStreak) {
    return (
      <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
        <View style={styles.emptyState}>
          {/* Empty state - wird nach Migration nie erreicht */}
        </View>
      </Animated.View>
    );
  }

  const dailyStreak = stats.dailyStreak;
  // maxRegularShields wird jetzt dynamisch via useEffect berechnet (Yearly=4, Monthly=3, Free=2)
  // Berechne den nächsten Montag ab HEUTE, nicht ab lastShieldResetDate
  const nextResetDate = getNextMonday(new Date());

  // Display values: Use mock data if available, otherwise real data
  const displayStreak = mockData?.currentStreak ?? dailyStreak.currentStreak;
  const displayLongestStreak = mockData?.longestStreak ?? dailyStreak.longestDailyStreak;
  const displayShieldsAvailable = mockData?.shieldsAvailable ?? dailyStreak.shieldsAvailable;
  const displayMaxRegular = mockData?.maxRegularShields ?? maxRegularShields;
  const displayBonusShields = mockData?.bonusShields ?? dailyStreak.bonusShields;
  const displaySupporterStatus = mockData?.supporterStatus ?? supporterStatus;

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero: Current Streak Card mit integriertem Kalender */}
        <CurrentStreakCard
          currentStreak={displayStreak}
          longestStreak={displayLongestStreak}
          playHistory={dailyStreak.playHistory}
          firstLaunchDate={dailyStreak.firstLaunchDate}
        />

        {/* Schutzschilder - NACH dem Kalender */}
        <ShieldIndicator
          available={displayShieldsAvailable}
          maxRegular={displayMaxRegular}
          bonusShields={displayBonusShields}
          nextResetDate={nextResetDate}
          onOpenSupportShop={onOpenSupportShop}
          supporterStatus={displaySupporterStatus}
        />

        {/* Statistiken */}
        <StreakStats
          currentStreak={displayStreak}
          longestStreak={displayLongestStreak}
          totalDaysPlayed={dailyStreak.totalDaysPlayed}
          completedMonths={dailyStreak.completedMonths.length}
          totalShieldsUsed={dailyStreak.totalShieldsUsed}
        />

        {/* Dev Tool - nur in DEV sichtbar */}
        {__DEV__ && (
          <StreakDevTool
            currentMock={mockData}
            onSimulate={setMockData}
            onReset={() => setMockData(null)}
          />
        )}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    paddingVertical: spacing.lg, // 24px - consistent with GameCompletion
    paddingHorizontal: spacing.lg, // 24px - consistent with GameCompletion
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StreakTab;
