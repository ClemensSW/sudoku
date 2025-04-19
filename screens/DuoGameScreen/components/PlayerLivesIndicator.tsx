// screens/DuoGameScreen/components/PlayerLivesIndicator.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  FadeIn,
} from "react-native-reanimated";

interface PlayerLivesIndicatorProps {
  player: 1 | 2;
  lives: number;
  maxLives: number;
}

const PlayerLivesIndicator: React.FC<PlayerLivesIndicatorProps> = ({
  player,
  lives,
  maxLives = 3,
}) => {
  // Animation value für Pulsieren beim Lebensverlust
  const scale = useSharedValue(1);
  
  // Farben je nach Spieler
  const heartColor = player === 1 ? "#4A7D78" : "#5B5D6E";
  const heartEmptyColor = player === 1 ? "rgba(74, 125, 120, 0.3)" : "rgba(91, 93, 110, 0.3)";
  
  // Pulsieren beim Ändern der Leben
  useEffect(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, [lives]);
  
  // Animierter Stil
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(500)}
    >
      <View style={styles.heartsRow}>
        {Array.from({ length: maxLives }).map((_, index) => {
          const isFilled = index < lives;
          
          return (
            <Animated.View
              key={`heart-${player}-${index}`}
              style={[
                styles.heartContainer,
                index === maxLives - lives && animatedStyle,
              ]}
            >
              <Feather
                name={"heart"}
                size={16}
                color={isFilled ? heartColor : heartEmptyColor}
                style={{ opacity: isFilled ? 1 : 0.6 }}
              />
            </Animated.View>
          );
        })}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    height: 24,
  },
  heartsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  heartContainer: {
    marginHorizontal: 2,
  },
});

export default PlayerLivesIndicator;