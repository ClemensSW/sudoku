// components/LevelProgress/components/LevelBadge.tsx
import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { LevelInfo } from '../utils/types';

interface LevelBadgeProps {
  levelInfo: LevelInfo;
  size?: number;
  showAnimation?: boolean;
  animationDelay?: number;
  style?: any;
}

const LevelBadge: React.FC<LevelBadgeProps> = ({
  levelInfo,
  size = 50,
  showAnimation = false,
  animationDelay = 0,
  style,
}) => {
  // Animation values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const glow = useSharedValue(0);
  
  // Pfadfarbe aus den Level-Infos
  const pathColor = levelInfo.currentPath.color;
  const isPathTransition = levelInfo.levelData.pathIndex === 0;
  
  // Level-Nummer (1-basiert für die Anzeige)
  const levelNumber = levelInfo.currentLevel + 1;
  
  // Starten der Animationen
  useEffect(() => {
    if (showAnimation) {
      // Verzögerte Sequenz für besseren visuellen Effekt
      scale.value = withDelay(
        animationDelay,
        withSequence(
          // Kurz schrumpfen
          withTiming(0.8, { 
            duration: 100, 
            easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
          }),
          // Größer werden als normal
          withTiming(1.3, { 
            duration: 400, 
            easing: Easing.bezier(0.25, 1.5, 0.5, 1) 
          }),
          // Zurück zur normalen Größe
          withTiming(1, { 
            duration: 300, 
            easing: Easing.bezier(0.25, 0.1, 0.25, 1) 
          })
        )
      );
      
      // Kleine Drehung für zusätzlichen Effekt
      rotation.value = withDelay(
        animationDelay + 100,
        withSequence(
          withTiming(-0.1, { duration: 200 }),
          withTiming(0.1, { duration: 400 }),
          withTiming(0, { duration: 300 })
        )
      );
      
      // Gloweffekt
      glow.value = withDelay(
        animationDelay + 300,
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(0.3, { duration: 1000 })
        )
      );
    } else if (isPathTransition) {
      // Sanfte Pulsation für den Anfang eines neuen Pfades
      scale.value = withSequence(
        withTiming(1.1, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      );
      
      // Kontinuierlicher Gloweffekt
      glow.value = withSequence(
        withTiming(0.6, { duration: 1500 }),
        withTiming(0.2, { duration: 1500 })
      );
    }
  }, [showAnimation, isPathTransition]);
  
  // Animierte Styles
  const badgeAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}rad` }
    ],
  }));
  
  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glow.value,
  }));
  
  // Berechnung der Textgröße basierend auf der Badge-Größe
  const fontSize = Math.max(size * 0.45, 16);
  
  // Styles für das Badge
  const badgeStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: pathColor,
  };
  
  // Styles für den Glow-Effekt
  const glowStyles = {
    width: size * 1.2,
    height: size * 1.2,
    borderRadius: size * 0.6,
    backgroundColor: pathColor,
    position: 'absolute' as 'absolute',
    top: -size * 0.1,
    left: -size * 0.1,
  };

  return (
    <View style={[styles.container, style]}>
      {/* Glow-Effekt (hinter dem Badge) */}
      <Animated.View style={[glowStyles, glowAnimatedStyle]} />
      
      {/* Hauptbadge */}
      <Animated.View style={[styles.badge, badgeStyles, badgeAnimatedStyle]}>
        <Text style={[styles.levelNumber, { fontSize }]}>
          {levelNumber}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // Für den Glow-Effekt
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  levelNumber: {
    color: '#FFFFFF',
    fontWeight: '800',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default LevelBadge;