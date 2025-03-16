// screens/DuoScreen/components/DuoBoardVisualizer/DuoBoardVisualizer.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import styles from "./DuoBoardVisualizer.styles";

// Demo puzzle numbers for visualization
const DEMO_NUMBERS = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9],
];

interface DuoBoardVisualizerProps {}

const DuoBoardVisualizer: React.FC<DuoBoardVisualizerProps> = () => {
  const theme = useTheme();
  const colors = theme.colors;

  // Render a demo board cell
  const renderDemoCell = (row: number, col: number) => {
    const isP1Area = row > 4 || (row === 4 && col > 4);
    const isP2Area = row < 4 || (row === 4 && col < 4);
    const isMiddleCell = row === 4 && col === 4;
    const value = DEMO_NUMBERS[row][col];

    return (
      <View
        key={`cell-${row}-${col}`}
        style={[
          styles.demoCell,
          isMiddleCell && styles.middleCell,
          isP1Area && styles.player1Cell,
          isP2Area && styles.player2Cell,
        ]}
      >
        {isMiddleCell ? (
          // Yin Yang icon in the middle
          <View style={styles.yinYangContainer}>
            <Image
              source={require("@/assets/images/icons/yin-yang.png")}
              style={styles.yinYangImage}
              resizeMode="contain"
            />
          </View>
        ) : (
          value > 0 && (
            <Text
              style={[
                styles.demoCellText,
                { color: colors.textPrimary },
                isP2Area && styles.rotatedText,
              ]}
            >
              {value}
            </Text>
          )
        )}
      </View>
    );
  };

  return (
    <View style={styles.boardContainer}>
      {/* Player 2 Label */}
      <View style={styles.playerIndicator}>
        <View style={[styles.playerTag, { backgroundColor: colors.warning }]}>
          <Feather
            name="user"
            size={14}
            color="#fff"
            style={styles.playerIcon}
          />
          <Text style={styles.playerText}>SPIELER 2</Text>
        </View>
      </View>

      {/* Demo Sudoku Board */}
      <View
        style={[
          styles.demoBoard,
          {
            backgroundColor: theme.isDark
              ? "rgba(255,255,255,0.05)"
              : "rgba(0,0,0,0.02)",
            borderColor: theme.isDark
              ? "rgba(255,255,255,0.1)"
              : "rgba(0,0,0,0.1)",
          },
        ]}
      >
        {/* Board grid for visualization */}
        <View style={styles.grid}>
          {DEMO_NUMBERS.map((row, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.demoRow}>
              {row.map((_, colIndex) => renderDemoCell(rowIndex, colIndex))}
            </View>
          ))}
        </View>
      </View>

      {/* Player 1 Label */}
      <View style={styles.playerIndicator}>
        <View style={[styles.playerTag, { backgroundColor: colors.primary }]}>
          <Feather
            name="user"
            size={14}
            color="#fff"
            style={styles.playerIcon}
          />
          <Text style={styles.playerText}>SPIELER 1</Text>
        </View>
      </View>
    </View>
  );
};

export default DuoBoardVisualizer;
