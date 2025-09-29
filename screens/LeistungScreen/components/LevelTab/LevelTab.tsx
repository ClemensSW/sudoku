// screens/LeistungScreen/components/LevelTab/LevelTab.tsx
import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { GameStats } from "@/utils/storage";
import LevelProgress from "@/components/GameCompletionModal/components/LevelProgress/LevelProgress";
import { useTheme } from "@/utils/theme/ThemeProvider";

interface LevelTabProps {
  stats: GameStats;
  selectedTitle?: string | null;                    // ⬅️ NEU
  onTitleSelect?: (title: string | null) => void;   // ⬅️ NEU
}

const LevelTab: React.FC<LevelTabProps> = ({
  stats,
  selectedTitle = null,
  onTitleSelect,
}) => {
  // falls du Theme-Farben später brauchst – aktuell nur initialisiert
  const theme = useTheme();

  return (
    <Animated.View style={styles.container} entering={FadeIn.duration(300)}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <LevelProgress
          // bisher
          stats={stats}

          // 🔁 neue, von LevelProgress erwartete Props
          xp={stats.totalXP}
          previousXp={stats.totalXP} // kein Completion-Flow hier -> gleich setzen
          xpGain={0}
          justCompleted={false}

          // deine bisherigen Options kannst du behalten/erweitern
          options={{
            showPathDescription: true,
            showMilestones: true,
            textVisibility: "always",
          }}

          // 🔁 Titelauswahl durchreichen
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
