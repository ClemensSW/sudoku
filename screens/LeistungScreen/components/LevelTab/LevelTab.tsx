import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { GameStats } from "@/utils/storage";
import PlayerProgressionCard from "@/screens/GameCompletionScreen/components/PlayerProgressionCard";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface LevelTabProps {
  stats: GameStats;
  selectedTitle?: string | null;
  onTitleSelect?: (title: string | null) => void;
}

const LevelTab: React.FC<LevelTabProps> = ({
  stats,
  selectedTitle = null,
  onTitleSelect,
}) => {
  // Theme ggf. später verwenden
  const theme = useTheme();

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <PlayerProgressionCard
          stats={stats}
          xp={stats.totalXP}
          previousXp={stats.totalXP}
          xpGain={0}
          justCompleted={false}
          options={{
            showPathDescription: true,
            showMilestones: true,
            textVisibility: "always",
          }}
          selectedTitle={selectedTitle}
          onTitleSelect={onTitleSelect}
        />
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
