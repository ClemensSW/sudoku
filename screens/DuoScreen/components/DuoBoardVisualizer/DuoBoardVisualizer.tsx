// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn, SlideInUp } from "react-native-reanimated";
import styles from "./DuoBoardVisualizer.styles";

interface DuoBoardVisualizerProps {}

const DuoBoardVisualizer: React.FC<DuoBoardVisualizerProps> = () => {
  // Unsere Hauptfarben
  const PLAYER1_COLOR = "#CAD9D4"; // Salbei
  const PLAYER2_COLOR = "#F4F0E4"; // Creme
  const TEXT_COLOR = "#2D3748";    // Dunkelgrau

  // Beispielzahlen für Spieler 1 (unten)
  const renderPlayer1Numbers = () => {
    return (
      <View style={styles.numberGroup}>
        <View style={styles.numberCell}>
          <Text style={styles.numberText}>2</Text>
        </View>
        <View style={styles.numberCell}>
          <Text style={styles.numberText}>9</Text>
        </View>
        <View style={styles.numberCell}>
          <Text style={styles.numberText}>4</Text>
        </View>
      </View>
    );
  };

  // Beispielzahlen für Spieler 2 (oben, gedreht)
  const renderPlayer2Numbers = () => {
    return (
      <View style={styles.numberGroup}>
        <View style={[styles.numberCell, styles.rotatedNumberCell]}>
          <Text style={[styles.numberText]}>5</Text>
        </View>
        <View style={[styles.numberCell, styles.rotatedNumberCell]}>
          <Text style={[styles.numberText]}>3</Text>
        </View>
        <View style={[styles.numberCell, styles.rotatedNumberCell]}>
          <Text style={[styles.numberText]}>7</Text>
        </View>
      </View>
    );
  };

  return (
    <Animated.View 
      style={styles.boardContainer}
      entering={FadeIn.duration(800)}
    >
      {/* Player 2 Label (oben) */}
      <View style={styles.playerIndicator}>
        <View style={[styles.playerTag, { backgroundColor: PLAYER2_COLOR }]}>
          <Feather name="user" size={16} color={TEXT_COLOR} style={styles.playerIcon} />
          <Text style={[styles.playerText, { color: TEXT_COLOR }]}>SPIELER 2</Text>
        </View>
      </View>

      {/* Abstraktes Konzept-Brett */}
      <Animated.View 
        style={styles.conceptBoardContainer}
        entering={SlideInUp.delay(300).duration(500)}
      >
        <View style={styles.conceptBoard}>
          {/* Spieler 2 Bereich (oben, cremeweiß) */}
          <View style={[styles.playerArea, styles.player2Area]}>
            {renderPlayer2Numbers()}
          </View>

          {/* Spieler 1 Bereich (unten, salbei) */}
          <View style={[styles.playerArea, styles.player1Area]}>
            {renderPlayer1Numbers()}
          </View>
        </View>

        {/* Mittellinie zwischen den Spielerbereichen */}
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
        </View>

        {/* Yin-Yang Symbol in der Mitte */}
        <View style={styles.yinYangContainer}>
          <Image
            source={require("@/assets/images/icons/yin-yang.png")}
            style={styles.yinYangImage}
            resizeMode="contain"
          />
        </View>

        {/* Richtungspfeile für beide Spieler */}
        <View style={[styles.arrowContainer, styles.topArrow]}>
          <Feather name="arrow-down" size={18} color={TEXT_COLOR} style={{ transform: [{ rotate: "180deg" }] }} />
        </View>
        
        <View style={[styles.arrowContainer, styles.bottomArrow]}>
          <Feather name="arrow-down" size={18} color={TEXT_COLOR} />
        </View>
      </Animated.View>

      {/* Player 1 Label (unten) */}
      <View style={styles.playerIndicator}>
        <View style={[styles.playerTag, { backgroundColor: PLAYER1_COLOR }]}>
          <Feather name="user" size={16} color={TEXT_COLOR} style={styles.playerIcon} />
          <Text style={[styles.playerText, { color: TEXT_COLOR }]}>SPIELER 1</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default DuoBoardVisualizer;