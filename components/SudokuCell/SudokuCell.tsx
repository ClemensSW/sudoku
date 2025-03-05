import React, { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SudokuCell as SudokuCellType } from "@/utils/sudoku";
import styles from "./SudokuCell.styles";
import { useTheme } from "@/utils/theme";

interface SudokuCellProps {
  cell: SudokuCellType;
  row: number;
  col: number;
  isSelected: boolean;
  isRelated: boolean;
  sameValueHighlight?: boolean;
  onPress: (row: number, col: number) => void;
}

const SudokuCell: React.FC<SudokuCellProps> = ({
  cell,
  row,
  col,
  isSelected,
  isRelated,
  sameValueHighlight = false,
  onPress,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  // Bestimme die Styling-Klasse basierend auf dem Zustand der Zelle
  const getCellStyle = () => {
    const cellStyles = [styles.cell];

    // Gitterlinien
    if ((row + 1) % 3 === 0 && row !== 8) {
      cellStyles.push(styles.bottomBorder);
    }
    if ((col + 1) % 3 === 0 && col !== 8) {
      cellStyles.push(styles.rightBorder);
    }

    // Zellenhervorhebung
    if (isSelected) {
      cellStyles.push(styles.selectedCell);
    } else if (sameValueHighlight && cell.value !== 0) {
      cellStyles.push(styles.sameValueCell);
    } else if (isRelated) {
      cellStyles.push(styles.relatedCell);
    }

    // Zellentyp
    if (cell.isInitial) {
      cellStyles.push(styles.initialCell);
    }

    // Spezielles Highlighting
    if (cell.highlight === "error") {
      cellStyles.push(styles.errorCell);
    } else if (cell.highlight === "hint") {
      cellStyles.push(styles.hintCell);
    } else if (cell.highlight === "success") {
      cellStyles.push(styles.successCell);
    }

    return cellStyles;
  };

  // Bestimme die Textfarbe
  const getTextStyle = () => {
    const textStyles = [styles.cellText];

    if (isSelected) {
      textStyles.push(styles.selectedCellText);
    } else if (cell.isInitial) {
      textStyles.push(styles.initialCellText);
    } else if (!cell.isValid) {
      textStyles.push(styles.errorCellText);
    }

    return textStyles;
  };

  // Rendere die Notizen, wenn die Zelle leer ist
  const renderNotes = () => {
    if (cell.value !== 0 || cell.notes.length === 0) return null;

    return (
      <View style={styles.notesContainer}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <Text
            key={`note-${num}`}
            style={[
              styles.noteText,
              cell.notes.includes(num)
                ? styles.activeNote
                : styles.inactiveNote,
            ]}
          >
            {cell.notes.includes(num) ? num : ""}
          </Text>
        ))}
      </View>
    );
  };

  // Bestimme dynamische Farben basierend auf dem Zustand
  const getCellBackgroundColor = () => {
    if (cell.highlight === "error") return colors.cellBackgroundError;
    if (cell.highlight === "hint") return colors.cellBackgroundHint;
    if (cell.highlight === "success") return colors.cellBackgroundSuccess;
    if (isSelected) return colors.cellBackgroundSelected;
    if (sameValueHighlight && cell.value !== 0)
      return colors.cellBackgroundRelated;
    if (isRelated) return colors.cellBackgroundRelated;
    if (cell.isInitial) return colors.cellBackgroundInitial;
    return colors.cellBackground;
  };

  const getCellTextColor = () => {
    if (isSelected) return colors.textCellSelected;
    if (!cell.isValid) return colors.textCellError;
    if (cell.isInitial) return colors.textCellInitial;
    return colors.textCellNormal;
  };

  const dynamicStyles = {
    cell: {
      backgroundColor: getCellBackgroundColor(),
    },
    text: {
      color: getCellTextColor(),
    },
  };

  return (
    <TouchableOpacity
      style={[...getCellStyle(), dynamicStyles.cell]}
      onPress={() => onPress(row, col)}
      activeOpacity={0.7}
    >
      {cell.value !== 0 ? (
        <Text style={[...getTextStyle(), dynamicStyles.text, styles.cellValue]}>
          {cell.value}
        </Text>
      ) : (
        renderNotes()
      )}
    </TouchableOpacity>
  );
};

// Performance-Optimierung mit React.memo, um unnötige Renderings zu vermeiden
export default memo(SudokuCell, (prevProps, nextProps) => {
  // Nur neu rendern, wenn sich relevante Props ändern
  return (
    JSON.stringify(prevProps.cell) === JSON.stringify(nextProps.cell) &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isRelated === nextProps.isRelated &&
    prevProps.sameValueHighlight === nextProps.sameValueHighlight
  );
});
