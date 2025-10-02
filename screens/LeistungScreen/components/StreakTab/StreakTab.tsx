// screens/LeistungScreen/components/StreakTab/StreakTab.tsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { GameStats } from "@/utils/storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import StreakDisplay from "@/screens/GameCompletionScreen/components/StreakDisplay/StreakDisplay";

interface StreakTabProps {
  stats: GameStats;
}

const StreakTab: React.FC<StreakTabProps> = ({ stats }) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Check if the current streak is a record
  const isRecord = stats.currentStreak === stats.longestStreak && stats.longestStreak > 2;

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Streak Display Component */}
        <StreakDisplay
          currentStreak={stats.currentStreak}
          longestStreak={stats.longestStreak}
          isRecord={isRecord}
        />
        
        {/* Additional Streak Statistics could be added here */}
        {/* For example, a calendar view showing played days, streak history, etc. */}
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

export default StreakTab;