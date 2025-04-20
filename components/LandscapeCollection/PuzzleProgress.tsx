import React, { useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSequence, 
  withDelay,
  FadeIn,
  ZoomIn
} from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Landscape, LandscapeSegment } from "@/utils/landscapes/types";
import Button from "@/components/Button/Button";
import styles from "./PuzzleProgress.styles";

interface PuzzleProgressProps {
  landscape: Landscape | null;
  newlyUnlockedSegmentId?: number;
  isComplete?: boolean;
  onViewGallery: () => void;
}

const PuzzleProgress: React.FC<PuzzleProgressProps> = ({
  landscape,
  newlyUnlockedSegmentId,
  isComplete = false,
  onViewGallery
}) => {
  const theme = useTheme();
  const { colors } = theme;
  
  // Animation values
  const containerScale = useSharedValue(1);
  const segmentOpacities = useRef(
    Array(9).fill(0).map(() => useSharedValue(0))
  ).current;
  const progressWidth = useSharedValue(0);
  
  // If no landscape image is available, show a placeholder
  if (!landscape) {
    return (
      <Animated.View 
        style={[
          styles.container, 
          { backgroundColor: colors.surface }
        ]}
        entering={FadeIn.duration(500)}
      >
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Lade Landschaft...
        </Text>
      </Animated.View>
    );
  }
  
  // Calculate progress percentage
  const progressPercentage = (landscape.progress / 9) * 100;
  
  // Start animation effect
  useEffect(() => {
    // Container light scaling
    containerScale.value = withSequence(
      withTiming(1.02, { duration: 300 }),
      withTiming(1, { duration: 200 })
    );
    
    // Animate progress bar
    progressWidth.value = withTiming(progressPercentage, { duration: 1000 });
    
    // FIX: Animate ALL segments with appropriate delay, including locked ones
    landscape.segments.forEach((segment, index) => {
      // Calculate delay based on whether segment is unlocked or locked
      const delay = segment.isUnlocked 
        ? index * 100  // Gradual fade-in for unlocked
        : 500 + (index * 50); // Delayed fade-in for locked segments (after unlocked ones)
      
      // All segments get animated to visible, but locked ones appear later
      segmentOpacities[index].value = withDelay(
        delay, 
        withTiming(1, { duration: 500 })
      );
    });
    
    // Special animation for newly unlocked segment
    if (newlyUnlockedSegmentId !== undefined) {
      const segmentIndex = newlyUnlockedSegmentId;
      // Delay so all other segments appear first
      const delayAmount = landscape.segments.filter(s => s.isUnlocked).length * 100 + 200;
      
      // Special highlight animation for the new segment
      segmentOpacities[segmentIndex].value = withSequence(
        withTiming(0, { duration: 0 }),
        withDelay(
          delayAmount,
          withTiming(1, { duration: 600 })
        )
      );
    }
  }, [landscape, newlyUnlockedSegmentId]);
  
  // Animated styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: containerScale.value }]
  }));
  
  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`
  }));
  
  // Render a single segment
  const renderSegment = (segment: LandscapeSegment, index: number) => {
    const isUnlocked = segment.isUnlocked;
    const isNewlyUnlocked = index === newlyUnlockedSegmentId;
    
    // Animated style for the segment
    const segmentAnimatedStyle = useAnimatedStyle(() => ({
      opacity: segmentOpacities[index].value
    }));
    
    return (
      <Animated.View
        key={`segment-${index}`}
        style={[
          styles.segment,
          isUnlocked ? styles.unlockedSegment : styles.lockedSegment,
          isNewlyUnlocked && styles.newlyUnlockedSegment,
          segmentAnimatedStyle
        ]}
      >
        {!isUnlocked && (
          <Feather 
            name="lock" 
            size={16} 
            color="rgba(255,255,255,0.5)" 
          />
        )}
      </Animated.View>
    );
  };
  
  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.surface },
        containerAnimatedStyle
      ]}
      entering={FadeIn.duration(500)}
    >
      {/* Header with title and badge */}
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
          Landschafts-Sammlung
        </Text>
        
        {newlyUnlockedSegmentId !== undefined && (
          <Animated.View
            style={[
              styles.newSegmentBadge,
              { backgroundColor: colors.success }
            ]}
            entering={ZoomIn.duration(300).delay(300)}
          >
            <Feather name="plus" size={12} color="white" />
            <Text style={styles.newSegmentText}>
              Neues Segment
            </Text>
          </Animated.View>
        )}
        
        {isComplete && (
          <Animated.View
            style={[
              styles.newSegmentBadge,
              { backgroundColor: colors.success }
            ]}
            entering={ZoomIn.duration(300).delay(300)}
          >
            <Feather name="check" size={12} color="white" />
            <Text style={styles.newSegmentText}>
              Komplett
            </Text>
          </Animated.View>
        )}
      </View>
      
      {/* Puzzle preview with segments */}
      <View style={styles.puzzleContainer}>
        <Image
          source={landscape.previewSource}
          style={styles.puzzleImage}
        />
        
        {/* Grid overlay with segments */}
        <View style={styles.gridOverlay}>
          {landscape.segments.map(renderSegment)}
        </View>
        
        {/* Overlay for complete images */}
        {isComplete && (
          <Animated.View
            style={styles.celebrationOverlay}
            entering={FadeIn.duration(500).delay(800)}
          >
            <Text style={styles.completionText}>Bild komplett!</Text>
          </Animated.View>
        )}
      </View>
      
      {/* Progress indicator */}
      <View style={styles.progressTextContainer}>
        <Text style={[styles.progressText, { color: colors.textSecondary }]}>
          {landscape.progress}/9 Segmente freigeschaltet
        </Text>
        
        {/* Progress bar */}
        <View
          style={[
            styles.progressBar,
            { backgroundColor: theme.isDark 
              ? "rgba(255,255,255,0.1)" 
              : "rgba(0,0,0,0.1)" 
            }
          ]}
        >
          <Animated.View
            style={[
              styles.progressFill,
              { backgroundColor: colors.primary },
              progressAnimatedStyle
            ]}
          />
        </View>
      </View>
      
      {/* Gallery button */}
      <View style={styles.buttonContainer}>
        <Button
          title="Zur Galerie"
          variant="outline"
          icon={<Feather name="image" size={18} color={colors.primary} />}
          onPress={onViewGallery}
          iconPosition="left"
        />
      </View>
    </Animated.View>
  );
};

export default PuzzleProgress;