import React from "react";
import { StyleSheet, ScrollView, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { GameStats } from "@/utils/storage";
import LevelCard from "@/screens/GameCompletion/components/LevelCard";
import PathCard from "@/screens/GameCompletion/components/PathCard";
import { spacing } from "@/utils/theme";

interface LevelTabProps {
  stats: GameStats;
  selectedTitleIndex?: number | null;
  onTitleSelect?: (levelIndex: number | null) => void;
  forceShowTitleModal?: boolean;
}

const LevelTab: React.FC<LevelTabProps> = ({
  stats,
  selectedTitleIndex = null,
  onTitleSelect,
  forceShowTitleModal = false,
}) => {
  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Level Card - shows XP, progress, title selection */}
        <LevelCard
          stats={stats}
          xp={stats.totalXP}
          previousXp={stats.totalXP}
          xpGain={0}
          justCompleted={false}
          selectedTitleIndex={selectedTitleIndex}
          onTitleSelect={onTitleSelect}
          forceShowTitleModal={forceShowTitleModal}
        />

        {/* Spacer */}
        <View style={{ height: spacing.lg }} />

        {/* Path Card - shows path trail, milestones */}
        <PathCard
          stats={stats}
          xp={stats.totalXP}
          previousXp={stats.totalXP}
          justCompleted={false}
          xpGain={0}
          showPathDescription={true}
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
    paddingVertical: spacing.lg, // 24px - consistent with GameCompletion
    paddingHorizontal: spacing.lg, // 24px - consistent with GameCompletion
  },
});

export default LevelTab;
