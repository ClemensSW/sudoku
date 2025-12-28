// screens/DuoGameScreen/components/DuoGameCell.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { SudokuCell } from "@/utils/sudoku";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { CELL_SIZE } from "@/screens/Game/components/SudokuBoard/SudokuBoard.styles";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { getPlayerCellColors, getZoneDividerBorders, getDividerColor, type DuoPlayerId } from "@/utils/duoColors";
import { useStoredColorHex } from "@/contexts/color/ColorContext";

interface DuoGameCellProps {
  cell: SudokuCell;
  row: number;
  col: number;
  player: 0 | 1 | 2; // 0 = neutral/middle, 1 = bottom, 2 = top
  isSelected: boolean;
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
  onPress,
  rotateForPlayer2 = true,
  showErrors = true,
}) => {
  const { isDark } = useTheme();
  const pathColorHex = useStoredColorHex();

  // Mittlere Zelle (4,4) - der neutrale Treffpunkt
  const isMiddleCell = row === 4 && col === 4;
  // Row/Col für Schachbrett-Berechnung übergeben
  const theme = React.useMemo(
    () => getPlayerCellColors(player as DuoPlayerId, pathColorHex, isDark, row, col),
    [player, pathColorHex, isDark, row, col]
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

  // Intelligente Border-Logik: An 3×3 Grenzen keinen Border, dort ist Grid-Linie
  const getBorderWidths = () => {
    const base = 0.5;
    return {
      borderTopWidth: base,
      borderLeftWidth: base,
      // Unterer Border: Entfernen bei Row 2 und 5 (dort sind horizontale Grid-Linien)
      borderBottomWidth: (row === 2 || row === 5) ? 0 : base,
      // Rechter Border: Entfernen bei Col 2 und 5 (dort sind vertikale Grid-Linien)
      borderRightWidth: (col === 2 || col === 5) ? 0 : base,
    };
  };

  // Zonen-Trennlinie in Path Color mit leichter Transparenz
  const dividerBorders = getZoneDividerBorders(row, col);
  const dividerBorderWidth = 2;
  const dividerColor = getDividerColor(pathColorHex); // 70% Opacity
  const getDividerBorderStyle = () => {
    const style: any = {};
    const hasDivider = dividerBorders.bottom;

    // Höherer z-Index für Zellen mit Trennlinie
    if (hasDivider) {
      style.zIndex = 10;
    }

    if (dividerBorders.bottom) {
      style.borderBottomWidth = dividerBorderWidth;
      style.borderBottomColor = dividerColor;
    }

    return style;
  };

  // Multi-Layer Mulden-Styles für intensive Tiefe (5 Ringe)
  // Light Mode: Hellere Grautöne oben/links, Path Color Töne unten/rechts
  const getMiddleCellRing1Style = () => ({
    flex: 1,
    borderWidth: 2,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.40)', // Helleres Grau
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0.40)',
    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.12)' : pathColorHex + '18', // 9% Path Color
    borderRightColor: isDark ? 'rgba(255, 255, 255, 0.12)' : pathColorHex + '18',
  });

  const getMiddleCellRing2Style = () => ({
    flex: 1,
    borderWidth: 1,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.32)', // Helleres Grau
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.6)' : 'rgba(0, 0, 0, 0.32)',
    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.1)' : pathColorHex + '12', // 7% Path Color
    borderRightColor: isDark ? 'rgba(255, 255, 255, 0.1)' : pathColorHex + '12',
  });

  const getMiddleCellRing3Style = () => ({
    flex: 1,
    borderWidth: 1,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.24)', // Helleres Grau
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.24)',
    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.08)' : pathColorHex + '0D', // 5% Path Color
    borderRightColor: isDark ? 'rgba(255, 255, 255, 0.08)' : pathColorHex + '0D',
  });

  const getMiddleCellRing4Style = () => ({
    flex: 1,
    borderWidth: 1,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.18)', // Helleres Grau
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.18)',
    borderBottomColor: isDark ? 'rgba(255, 255, 255, 0.05)' : pathColorHex + '08', // 3% Path Color
    borderRightColor: isDark ? 'rgba(255, 255, 255, 0.05)' : pathColorHex + '08',
  });

  const getMiddleCellRing5Style = () => ({
    flex: 1,
    borderWidth: 1,
    borderTopColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.12)', // Helleres Grau
    borderLeftColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.12)',
    borderBottomColor: 'transparent',
    borderRightColor: 'transparent',
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

  // Mittlere Zelle: Multi-Layer Mulden-Struktur
  if (isMiddleCell) {
    return (
      <TouchableOpacity
        style={[
          styles.cellContainer,
          {
            backgroundColor: 'transparent',
            // Zentrierung aufheben damit flex: 1 der Ringe funktioniert
            justifyContent: 'flex-start',
            alignItems: 'stretch',
          },
        ]}
        onPress={() => onPress(row, col)}
        disabled={cell.isInitial}
        activeOpacity={1}
      >
        {/* 5 verschachtelte Ringe für tiefe Mulde */}
        <View style={getMiddleCellRing1Style()}>
          <View style={getMiddleCellRing2Style()}>
            <View style={getMiddleCellRing3Style()}>
              <View style={getMiddleCellRing4Style()}>
                <View style={getMiddleCellRing5Style()}>
                  {renderCellContent()}
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // Normale Zellen
  return (
    <TouchableOpacity
      style={[
        styles.cellContainer,
        { backgroundColor: getCellBackgroundColor() },
        {
          ...getBorderWidths(),
          borderColor: "rgba(0, 0, 0, 0.2)",
        },
        getDividerBorderStyle(),
      ]}
      onPress={() => onPress(row, col)}
      disabled={cell.isInitial}
      activeOpacity={cell.isInitial ? 1 : 0.7}
    >
      {renderCellContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cellContainer: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cellContent: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
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
    (prev.showErrors ?? true) === (next.showErrors ?? true) &&
    cellsEqual(prev.cell, next.cell)
  );
}

export default React.memo(DuoGameCell, propsEqual);
