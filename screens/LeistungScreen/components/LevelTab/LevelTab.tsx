// screens/LeistungScreen/components/LevelTab/LevelTab.tsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { GameStats } from "@/utils/storage";
import LevelProgress from "@/components/GameCompletionModal/components/LevelProgress/LevelProgress";
import { useLevelInfo } from "@/components/GameCompletionModal/components/LevelProgress/utils/useLevelInfo";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface LevelTabProps {
  stats: GameStats;
}

const LevelTab: React.FC<LevelTabProps> = ({ stats }) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Use the useLevelInfo hook to get the user's current level info
  const levelInfo = useLevelInfo(stats.totalXP);

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Level Progress Card */}
        <LevelProgress
          stats={stats}
          difficulty="medium" // Default difficulty as there's no active game
          justCompleted={false}
          options={{
            showPathDescription: true,
            textVisibility: 'always',
            showMilestones: true,
          }}
        />
        
        {/* You could add more level-related content here */}
        {/* For example, level milestones, achievements, etc. */}
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    paddingVertical: 16,
  },
});

export default LevelTab;