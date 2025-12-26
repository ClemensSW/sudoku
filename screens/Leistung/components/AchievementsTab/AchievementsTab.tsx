// screens/Leistung/components/AchievementsTab/AchievementsTab.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { GameStats } from '@/utils/storage';
import { styles } from './AchievementsTab.styles';

// Components
import GamesHero from './components/GamesHero';
import DifficultyBreakdown from './components/DifficultyBreakdown';
import BestTimesChart from '@/screens/Leistung/components/BestTimesChart/BestTimesChart';

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

        {/* 2. Difficulty Breakdown */}
        <DifficultyBreakdown
          easy={stats.completedEasy}
          medium={stats.completedMedium}
          hard={stats.completedHard}
          expert={stats.completedExpert}
        />

        {/* 3. Best Times Chart */}
        <BestTimesChart stats={stats} />
      </ScrollView>
    </Animated.View>
  );
};

export default AchievementsTab;
