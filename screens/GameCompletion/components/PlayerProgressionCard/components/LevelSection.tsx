// components/GameCompletionModal/components/PlayerProgressionCard/components/LevelSection.tsx
import React from "react";
import { View } from "react-native";
import { LevelInfo } from "../utils/types";
import LevelCard from "@/screens/GameCompletion/components/LevelCard";

type LevelSectionProps = {
  levelInfo: LevelInfo;
  xpGain?: number;
  justCompleted: boolean;
  compact: boolean;
  progressColor: string;
  badgeAnimatedStyle: any;
  xpGainAnimatedStyle: any;
  progressAnimatedStyle: any;
  previousProgressAnimatedStyle: any;
  gainIndicatorAnimatedStyle: any;
  hasLevelChanged: boolean;
  showLevelUpOverlay: boolean;
  previousProgressWidth: any;
  selectedTitle: string | null;
  onTitleSelect: (title: string | null) => void;
};

const LevelSection: React.FC<LevelSectionProps> = ({
  levelInfo,
  xpGain,
  justCompleted,
  selectedTitle,
  onTitleSelect,
}) => {
  // Calculate current XP from levelInfo
  const currentXp = levelInfo.levelData.xp + (levelInfo.progressPercentage / 100) * levelInfo.xpForNextLevel;

  return (
    <View>
      <LevelCard
        xp={currentXp}
        previousXp={currentXp}
        justCompleted={justCompleted}
        xpGain={xpGain}
        selectedTitle={selectedTitle}
        onTitleSelect={onTitleSelect}
      />
    </View>
  );
};

export default LevelSection;
