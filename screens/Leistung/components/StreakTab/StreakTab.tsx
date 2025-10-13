// screens/Leistung/components/StreakTab/StreakTab.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { GameStats } from '@/utils/storage';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { spacing } from '@/utils/theme';
import { getCurrentYearMonth, getNextMonday, claimMonthlyReward } from '@/utils/dailyStreak';
import { getSupporterStatus } from '@/modules/subscriptions/entitlements';
import { loadStats, saveStats } from '@/utils/storage';

// Import components from GameCompletion/StreakCard
import {
  CurrentStreakCard,
  ShieldIndicator,
  StreakCalendar,
  StreakStats,
  MonthlyRewardModal,
} from '@/screens/GameCompletion/components/StreakCard/components';

interface StreakTabProps {
  stats: GameStats;
  onOpenSupportShop?: () => void;
}

const StreakTab: React.FC<StreakTabProps> = ({ stats, onOpenSupportShop }) => {
  const theme = useTheme();
  const colors = theme.colors;
  const isFocused = useIsFocused();

  // State
  const [currentMonth, setCurrentMonth] = useState(getCurrentYearMonth());
  const [isPremium, setIsPremium] = useState(false);
  const [supporterStatus, setSupporterStatus] = useState<'none' | 'one-time' | 'subscription'>('none');
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [pendingRewardMonth, setPendingRewardMonth] = useState<string | null>(null);

  // Check premium status for shield count & pending rewards
  // Aktualisiert sich bei jedem Screen-Focus (z.B. nach Kauf im SupportShop)
  useEffect(() => {
    if (!isFocused) return;

    (async () => {
      try {
        const status = await getSupporterStatus();
        setIsPremium(status.isPremiumSubscriber);
        setSupporterStatus(status.supportType || 'none');

        // Check for unclaimed rewards
        if (stats.dailyStreak) {
          const playHistory = stats.dailyStreak.playHistory;
          for (const [yearMonth, monthData] of Object.entries(playHistory)) {
            if (monthData.completed && monthData.reward && !monthData.reward.claimed) {
              setPendingRewardMonth(yearMonth);
              setShowRewardModal(true);
              break; // Show only first unclaimed reward
            }
          }
        }
      } catch (error) {
        console.error('[StreakTab] Error checking premium status:', error);
      }
    })();
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
  const maxRegularShields = isPremium ? 3 : 2;
  const nextResetDate = getNextMonday(new Date(dailyStreak.lastShieldResetDate));

  // Handler für Monatswechsel
  const handleMonthChange = (yearMonth: string) => {
    setCurrentMonth(yearMonth);
  };

  // Handler für Reward-Claim
  const handleClaimReward = async () => {
    if (!pendingRewardMonth) return;

    try {
      const success = await claimMonthlyReward(pendingRewardMonth);
      if (success) {
        // Reload stats to update UI
        const updatedStats = await loadStats();
        // Trigger stats refresh in parent (Leistung.tsx)
        // For now, just close modal
        setShowRewardModal(false);
        setPendingRewardMonth(null);
      }
    } catch (error) {
      console.error('[StreakTab] Error claiming reward:', error);
    }
  };

  const handleCloseModal = () => {
    setShowRewardModal(false);
  };

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero: Current Streak Card */}
        <CurrentStreakCard
          currentStreak={dailyStreak.currentStreak}
          longestStreak={dailyStreak.longestDailyStreak}
        />

        {/* Monatskalender */}
        <StreakCalendar
          currentMonth={currentMonth}
          playHistory={dailyStreak.playHistory}
          onMonthChange={handleMonthChange}
        />

        {/* Schutzschilder - NACH dem Kalender */}
        <ShieldIndicator
          available={dailyStreak.shieldsAvailable}
          maxRegular={maxRegularShields}
          bonusShields={dailyStreak.bonusShields}
          nextResetDate={nextResetDate}
          onOpenSupportShop={onOpenSupportShop}
          supporterStatus={supporterStatus}
        />

        {/* Statistiken */}
        <StreakStats
          currentStreak={dailyStreak.currentStreak}
          longestStreak={dailyStreak.longestDailyStreak}
          totalDaysPlayed={dailyStreak.totalDaysPlayed}
          completedMonths={dailyStreak.completedMonths.length}
          totalShieldsUsed={dailyStreak.totalShieldsUsed}
        />
      </ScrollView>

      {/* Monthly Reward Modal */}
      {pendingRewardMonth && (
        <MonthlyRewardModal
          visible={showRewardModal}
          yearMonth={pendingRewardMonth}
          rewardType={dailyStreak.playHistory[pendingRewardMonth]?.reward?.type || 'bonus_shields'}
          rewardValue={dailyStreak.playHistory[pendingRewardMonth]?.reward?.value}
          onClaim={handleClaimReward}
          onClose={handleCloseModal}
        />
      )}
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
