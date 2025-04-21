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
          Lade Bild...
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
    
    // Only animate unlocked segments to be visible
    landscape.segments.forEach((segment, index) => {
      if (segment.isUnlocked) {
        // Only animate unlocked segments to full opacity
        const delay = index * 100; // Gradual fade-in for unlocked segments
        segmentOpacities[index].value = withDelay(
          delay, 
          withTiming(1, { duration: 500 })
        );
      } else {
        // Keep locked segments at 0 opacity (hidden)
        segmentOpacities[index].value = withTiming(0);
      }
    });
    
    // Special animation for newly unlocked segment
    if (newlyUnlockedSegmentId !== undefined) {
      const segmentIndex = newlyUnlockedSegmentId;
      // Delay so all other segments appear first
      const delayAmount = 800; // Fixed delay for better visibility
      
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
  
  // Get theme-appropriate styling for locked segments
  const getLockedSegmentStyle = () => {
    if (theme.isDark) {
      return {
        backgroundColor: "rgba(45, 55, 72, 0.95)",
        borderColor: "rgba(255, 255, 255, 0.3)",
      };
    } else {
      return {
        backgroundColor: "rgba(240, 247, 247, 0.95)",
        borderColor: "rgba(0, 0, 0, 0.2)",
      };
    }
  };
  
  // Get theme-appropriate styling for newly unlocked segments
  const getNewlyUnlockedStyle = () => {
    return {
      backgroundColor: `${colors.primary}30`, // Primary color with transparency
      borderColor: theme.isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.2)",
    };
  };
  
  // Get theme-appropriate lock icon color
  const getLockIconColor = () => {
    return theme.isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)";
  };
  
  // Render a single segment
  const renderSegment = (segment: LandscapeSegment, index: number) => {
    const isUnlocked = segment.isUnlocked;
    const isNewlyUnlocked = index === newlyUnlockedSegmentId;
    
    // Animated style for the segment
    const segmentAnimatedStyle = useAnimatedStyle(() => ({
      opacity: isUnlocked ? segmentOpacities[index].value : 1, // Locked segments always visible (but filled with color)
    }));
    
    // Get appropriate styling based on segment state and theme
    const lockedStyle = getLockedSegmentStyle();
    const newlyUnlockedStyle = getNewlyUnlockedStyle();
    
    return (
      <Animated.View
        key={`segment-${index}`}
        style={[
          styles.segment,
          isUnlocked ? styles.unlockedSegment : {
            ...styles.lockedSegment,
            backgroundColor: lockedStyle.backgroundColor,
            borderColor: lockedStyle.borderColor,
          },
          isNewlyUnlocked && {
            ...styles.newlyUnlockedSegment,
            backgroundColor: newlyUnlockedStyle.backgroundColor,
            borderColor: newlyUnlockedStyle.borderColor,
          },
          segmentAnimatedStyle
        ]}
      >
        {!isUnlocked && (
          <Feather 
            name="lock" 
            size={16} 
            color={getLockIconColor()} 
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
          Bild-Sammlung
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
            style={[
              styles.celebrationOverlay,
              {
                backgroundColor: theme.isDark 
                  ? "rgba(0, 0, 0, 0.3)" 
                  : "rgba(0, 0, 0, 0.2)"
              }
            ]}
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