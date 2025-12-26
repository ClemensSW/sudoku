// screens/Leistung/components/AchievementsTab/AchievementsTab.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { GameStats } from '@/utils/storage';
import { styles } from './AchievementsTab.styles';

// Components
import GamesHero from './components/GamesHero';
import StatsCard from './components/StatsCard';

interface AchievementsTabProps {
  stats: GameStats;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ stats }) => {
  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero: Games Played & Win Rate */}
        <GamesHero
          gamesPlayed={stats.gamesPlayed}
          gamesWon={stats.gamesWon}
        />

        {/* 2. Stats Card with Toggle (Games/Times) */}
        <StatsCard
          easy={stats.completedEasy}
          medium={stats.completedMedium}
          hard={stats.completedHard}
          expert={stats.completedExpert}
          bestTimeEasy={stats.bestTimeEasy}
          bestTimeMedium={stats.bestTimeMedium}
          bestTimeHard={stats.bestTimeHard}
          bestTimeExpert={stats.bestTimeExpert}
        />
      </ScrollView>
    </Animated.View>
  );
};

export default AchievementsTab;
