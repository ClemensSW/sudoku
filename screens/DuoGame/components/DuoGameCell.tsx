// screens/DuoGameScreen/components/DuoGameCell.tsx
// Gap-basiertes Layout mit Flex (wie Single-Player SudokuCell)
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SudokuCell } from "@/utils/sudoku";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
  withRepeat,
  Easing,
} from "react-native-reanimated";
import { CELL_SIZE } from "./DuoGameBoard.styles";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { getPlayerCellColors, getDividerColor, type DuoPlayerId } from "@/utils/duoColors";
import { useProgressColor } from "@/contexts/color/ColorContext";
import { lightenColor } from "@/utils/colorHelpers";

interface DuoGameCellProps {
  cell: SudokuCell;
  row: number;
  col: number;
  player: 0 | 1 | 2; // 0 = neutral/middle, 1 = bottom, 2 = top
  isSelected: boolean;
  isCheckerboard: boolean; // Schachbrett-Pattern basierend auf Box-Position
  onPress: (row: number, col: number) => void; // stable, shared handler from parent
  rotateForPlayer2?: boolean;
  showErrors?: boolean;
}

const DuoGameCell: React.FC<DuoGameCellProps> = ({
  cell,
  row,
  col,
  player,
  isSelected,
  isCheckerboard,
  onPress,
  rotateForPlayer2 = true,
  showErrors = true,
}) => {
  const { isDark } = useTheme();
  const pathColorHex = useProgressColor();

  // Mittlere Zelle (4,4) - der neutrale Treffpunkt
  const isMiddleCell = row === 4 && col === 4;
  // Schachbrett-Pattern wird von Box-Komponente übergeben
  const theme = React.useMemo(
    () => getPlayerCellColors(player as DuoPlayerId, pathColorHex, isDark, isCheckerboard),
    [player, pathColorHex, isDark, isCheckerboard]
  );

  // Pulse animation only when *filled* by the player
  const scale = useSharedValue(1);
  React.useEffect(() => {
    if (cell.value !== 0 && !cell.isInitial) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 120 }),
        withTiming(1, { duration: 150 })
      );
    }
  }, [cell.value, cell.isInitial, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Colors für normale Zellen (mittlere Zelle hat eigene Multi-Layer Struktur)
  const getCellBackgroundColor = () => {
    if (isSelected && !cell.isValid && showErrors) {
      return theme.error.selectedBackground;
    }
    if (!cell.isValid && showErrors) {
      return theme.error.background;
    }
    if (isSelected) {
      return theme.selectedBackground;
    }
    return theme.cellBackground;
  };

  const getTextColor = () => {
    // Error state hat Priorität
    if (!cell.isValid && showErrors) return theme.error.textColor;
    // Selected cells haben weißen Text (auf Path Color Background)
    if (isSelected) return '#FFFFFF';
    // Initial numbers nutzen Theme Initial Color
    if (cell.isInitial) return theme.initial.textColor;
    // Normale numbers nutzen Theme Text Color
    return theme.textColor;
  };

  const shouldUnderlineNumber = (num: number) => num === 6 || num === 9;

  const getNotesColor = () => {
    // Selected cells haben weiße Notizen (auf Path Color Background)
    if (isSelected) return '#FFFFFF';
    // Normale Notizen nutzen Theme Notes Color
    return theme.notes.textColor;
  };

  const renderNotes = () => {
    if (cell.value !== 0 || !cell.notes || cell.notes.length === 0) return null;

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${num}`}
            style={[
              styles.noteText,
              { color: getNotesColor() },  // Dynamische Farbe: weiß wenn selected
              cell.notes.includes(num) ? styles.activeNote : styles.inactiveNote,
              player === 2 && rotateForPlayer2 && styles.rotatedText,
              shouldUnderlineNumber(num) && styles.underlinedNumber,
            ]}
          >
            {cell.notes.includes(num) ? num : ""}
          </Text>
        ))}
      </View>
    );
  };

  const shouldRotateContent = player === 2 && rotateForPlayer2;

  // Divider-Farbe für Center Cell (Fluss-Linien)
  const dividerColor = getDividerColor(pathColorHex);

  // Multi-Layer Mulden-Styles für intensive Tiefe (5 Ringe)
  // Light Mode: Hellere Grautöne oben/links, aufgehellte Path Color unten/rechts
  // Nutzt lightenColor für echte Helligkeit statt Opacity
  const getMiddleCellRing1Style = () => ({
    flex: 1,
    borderWidth: 2,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.40)',
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.40)',
    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.12)' : lightenColor(pathColorHex, 70),
    borderRightColor: isDark ? 'rgba(255, 255, 255, 0.12)' : lightenColor(pathColorHex, 70),
  });

  const getMiddleCellRing2Style = () => ({
    flex: 1,
    borderWidth: 1,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.32)',
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.32)',
    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : lightenColor(pathColorHex, 76),
    borderRightColor: isDark ? 'rgba(255, 255, 255, 0.1)' : lightenColor(pathColorHex, 76),
  });

  const getMiddleCellRing3Style = () => ({
    flex: 1,
    borderWidth: 1,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.24)',
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.24)',
    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : lightenColor(pathColorHex, 80),
    borderRightColor: isDark ? 'rgba(255, 255, 255, 0.08)' : lightenColor(pathColorHex, 80),
  });

  const getMiddleCellRing4Style = () => ({
    flex: 1,
    borderWidth: 1,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.18)',
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.18)',
    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : lightenColor(pathColorHex, 82),
    borderRightColor: isDark ? 'rgba(255, 255, 255, 0.05)' : lightenColor(pathColorHex, 82),
  });

  const getMiddleCellRing5Style = () => ({
    flex: 1,
    borderWidth: 1,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.12)',
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.12)',
    borderBottomColor: isDark ? 'transparent' : lightenColor(pathColorHex, 80),
    borderRightColor: isDark ? 'transparent' : lightenColor(pathColorHex, 80),
    // Hellerer Boden: Dark Mode 50%, Light Mode 25%
    backgroundColor: isDark ? getDividerColor(pathColorHex) : pathColorHex + '40',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  });

  // Render-Content für Zelle (wiederverwendbar)
  const renderCellContent = () => (
    <Animated.View
      style={[
        styles.cellContent,
        animatedStyle,
        shouldRotateContent && styles.rotatedContent,
      ]}
    >
      {cell.value !== 0 ? (
        <Text
          style={[
            styles.cellText,
            { color: getTextColor() },
            cell.isInitial && styles.initialText,
            shouldRotateContent && styles.rotatedText,
            shouldUnderlineNumber(cell.value) && styles.underlinedNumber,
          ]}
        >
          {cell.value}
        </Text>
      ) : (
        renderNotes()
      )}
    </Animated.View>
  );

  // Pulsierende Animation für Flusslinien (nur für mittlere Zelle relevant)
  const flowOpacity1 = useSharedValue(0.5);
  const flowOpacity2 = useSharedValue(0.5);

  React.useEffect(() => {
    if (!isMiddleCell) return;

    // Erste Linie pulsiert
    flowOpacity1.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );

    // Zweite Linie mit Versatz
    const timeout = setTimeout(() => {
      flowOpacity2.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [isMiddleCell, flowOpacity1, flowOpacity2]);

  const flowLine1Style = useAnimatedStyle(() => ({
    opacity: flowOpacity1.value,
  }));

  const flowLine2Style = useAnimatedStyle(() => ({
    opacity: flowOpacity2.value,
  }));

  // Mittlere Zelle: Multi-Layer Mulden-Struktur
  if (isMiddleCell) {
    // Diagonale "Fluss"-Linien die in die Mulde fließen
    const ringWidth = 6; // 2px + 1px + 1px + 1px + 1px
    const diagonalLength = ringWidth * Math.SQRT2;

    return (
      <Pressable
        style={[
          styles.cellContainer,
          styles.middleCellContainer,
        ]}
        onPress={() => onPress(row, col)}
      >
        {/* Diagonale Flusslinie links-unten → Mitte (animiert) */}
        <Animated.View style={[{
          position: 'absolute',
          width: diagonalLength,
          height: 2,
          backgroundColor: dividerColor,
          bottom: ringWidth / 2 - 1,
          left: -1,
          transform: [{ rotate: '-45deg' }],
          zIndex: 5,
        }, flowLine1Style]} />

        {/* Diagonale Flusslinie rechts-oben → Mitte (animiert) */}
        <Animated.View style={[{
          position: 'absolute',
          width: diagonalLength,
          height: 2,
          backgroundColor: dividerColor,
          top: ringWidth / 2 - 1,
          right: -1,
          transform: [{ rotate: '-45deg' }],
          zIndex: 5,
        }, flowLine2Style]} />

        {/* 5 verschachtelte Ringe für tiefe Mulde */}
        <View style={getMiddleCellRing1Style()}>
          <View style={getMiddleCellRing2Style()}>
            <View style={getMiddleCellRing3Style()}>
              <View style={getMiddleCellRing4Style()}>
                <View style={getMiddleCellRing5Style()}>
                  {/* Zell-Content (Zahl/Notizen) */}
                  {renderCellContent()}
                </View>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    );
  }

  // Normale Zellen - Zwei-Layer-Struktur (wie Single-Player SudokuCell)
  return (
    <Pressable
      style={styles.cellContainer}
      onPress={() => onPress(row, col)}
    >
      {/* Hintergrund-Layer - immer sichtbar für Gap-Layout */}
      <View style={[styles.cellBackground, { backgroundColor: getCellBackgroundColor() }]} />

      {/* Content-Layer mit Text oder Notizen */}
      {renderCellContent()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  // Flex-basierter Container (wie Single-Player SudokuCell)
  cellContainer: {
    flex: 1,
    aspectRatio: 1,
    position: "relative",
  },
  // Spezielle Styles für Center Cell (Mulden-Struktur)
  middleCellContainer: {
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  // Hintergrund-Layer - füllt gesamte Zelle
  cellBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  // Content-Layer für Text/Notizen
  cellContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  cellText: {
    fontSize: Math.max(CELL_SIZE * 0.5, 18),
    fontWeight: "300",
  },
  initialText: {
    fontWeight: "700",
  },
  notesContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    height: "100%",
    padding: 2,
  },
  noteText: {
    fontSize: Math.max(CELL_SIZE * 0.2, 9),
    width: "33%",
    height: "33%",
    textAlign: "center",
    textAlignVertical: "center",
  },
  activeNote: { opacity: 1 },
  inactiveNote: { opacity: 0 },
  rotatedContent: { transform: [{ rotate: "180deg" }] },
  rotatedText: { transform: [{ rotate: "180deg" }] },
  underlinedNumber: { textDecorationLine: "underline" },
});

// ---------- High-precision memo comparator to avoid 81 re-renders ----------
function arraysEqualShallow(a?: number[], b?: number[]) {
  if (a === b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function cellsEqual(a: SudokuCell, b: SudokuCell) {
  if (a === b) return true;
  return (
    a.value === b.value &&
    a.isInitial === b.isInitial &&
    // if your model exposes validity/notes; guard if undefined
    (a as any).isValid === (b as any).isValid &&
    arraysEqualShallow(a.notes, b.notes)
  );
}

function propsEqual(prev: Readonly<DuoGameCellProps>, next: Readonly<DuoGameCellProps>) {
  // Intentionally ignore row/col and onPress identity to keep cell renders minimal.
  return (
    prev.player === next.player &&
    prev.isSelected === next.isSelected &&
    prev.isCheckerboard === next.isCheckerboard &&
    (prev.showErrors ?? true) === (next.showErrors ?? true) &&
    cellsEqual(prev.cell, next.cell)
  );
}

export default React.memo(DuoGameCell, propsEqual);
