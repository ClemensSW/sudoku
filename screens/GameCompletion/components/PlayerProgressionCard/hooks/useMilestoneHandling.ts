// components/GameCompletionModal/components/PlayerProgressionCard/hooks/useMilestoneHandling.ts
import { useState, useCallback, useEffect } from "react";
import { useSharedValue, withSequence, withTiming } from "react-native-reanimated";
import { getMilestones } from "../utils/levelData";
import { GameStats, markMilestoneReached } from "@/utils/storage";
import { LevelInfo } from "../utils/types";
import { triggerHaptic } from "@/utils/haptics";

type UseMilestoneHandlingProps = {
  levelInfo: LevelInfo;
  stats?: GameStats;
  showMilestones: boolean;
  levelUpTriggered: boolean;
};

export function useMilestoneHandling({
  levelInfo,
  stats,
  showMilestones,
  levelUpTriggered,
}: UseMilestoneHandlingProps) {
  const [showMilestone, setShowMilestone] = useState(false);
  const [milestoneMessage, setMilestoneMessage] = useState("");
  const [milestoneLevel, setMilestoneLevel] = useState(0);
  const milestoneScale = useSharedValue(0.95);

  const checkAndShowMilestone = useCallback(async () => {
    if (!showMilestones) return;
    // Get fresh milestone translations
    const milestoneMessages = getMilestones();
    const reached = stats?.reachedMilestones || [];
    for (const lvl of Object.keys(milestoneMessages).map(Number)) {
      if (levelInfo.currentLevel >= lvl && !reached.includes(lvl)) {
        setMilestoneMessage(milestoneMessages[lvl]);
        setMilestoneLevel(lvl);
        await markMilestoneReached(lvl);
        setShowMilestone(true);
        triggerHaptic("success");
        milestoneScale.value = withSequence(
          withTiming(1.05, { duration: 300 }),
          withTiming(1, { duration: 200 })
        );
        break;
      }
    }
  }, [showMilestones, levelInfo.currentLevel, milestoneScale, stats]);

  const closeMilestone = useCallback(() => {
    milestoneScale.value = withTiming(0.9, { duration: 200 });
    setTimeout(() => setShowMilestone(false), 200);
  }, [milestoneScale]);

  // Trigger milestone check after level up animation completes
  useEffect(() => {
    if (!levelUpTriggered) {
      checkAndShowMilestone();
    }
  }, [levelUpTriggered, checkAndShowMilestone]);

  const milestoneAnimatedStyle = {
    transform: [{ scale: milestoneScale.value }],
  };

  return {
    showMilestone,
    milestoneMessage,
    milestoneLevel,
    milestoneAnimatedStyle,
    closeMilestone,
  };
}
