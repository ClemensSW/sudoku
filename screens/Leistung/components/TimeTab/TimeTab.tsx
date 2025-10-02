// screens/LeistungScreen/components/TimeTab/TimeTab.tsx
import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { GameStats } from "@/utils/storage";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import BestTimesChart from "@/screens/Leistung/components/BestTimesChart/BestTimesChart";

interface TimeTabProps {
  stats: GameStats;
}

const TimeTab: React.FC<TimeTabProps> = ({ stats }) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Best Times Chart Component */}
        <BestTimesChart stats={stats} />
        
        {/* Additional Time Statistics could be added here */}
        {/* For example, time improvement over time, average solve time, etc. */}
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

export default TimeTab;