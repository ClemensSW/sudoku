// screens/Leistung/components/AchievementsTab/AchievementsTab.tsx
import React from 'react';
import { ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { GameStats } from '@/utils/storage';
import { styles } from './AchievementsTab.styles';

// Components
import GamesHero from './components/GamesHero';

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
        {/* GamesHero with integrated Stats (like Serie with Calendar) */}
        <GamesHero
          gamesPlayed={stats.gamesPlayed}
          gamesWon={stats.gamesWon}
          completedEasy={stats.completedEasy}
          completedMedium={stats.completedMedium}
          completedHard={stats.completedHard}
          completedExpert={stats.completedExpert}
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
