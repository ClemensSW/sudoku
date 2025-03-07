// Zentralisiertes Theme-System für die Sudoku-App

// Basisfarben für das Sudoku-Spiel
export const SUDOKU_COLORS = {
    // Hauptfarben
    primary: "#4361EE", // Blauer Hintergrund wie im Logo
    primaryLight: "#738BFF",
    primaryDark: "#3046C0",
    
    // Weißtöne mit verschiedenen Transparenzen
    white: "#FFFFFF",
    whiteTransparent10: "rgba(255, 255, 255, 0.1)",
    whiteTransparent15: "rgba(255, 255, 255, 0.15)",
    whiteTransparent20: "rgba(255, 255, 255, 0.2)",
    whiteTransparent30: "rgba(255, 255, 255, 0.3)",
    whiteTransparent35: "rgba(255, 255, 255, 0.35)",
    whiteTransparent60: "rgba(255, 255, 255, 0.6)",
    whiteTransparent85: "rgba(255, 255, 255, 0.85)",
    
    // Spezialisierte Farben für Feedback
    error: "rgba(255, 100, 100, 0.35)",
    errorText: "#FFC0C0",
    success: "rgba(152, 255, 152, 0.3)",
    hint: "rgba(255, 255, 100, 0.3)",
    
    // Schatten
    shadow: "#000000",
    overlay: "rgba(0, 0, 0, 0.4)",
  };
  
  // Zellentypen
  export const CELL_STYLES = {
    // Grundlegende Zelle
    cell: {
      borderColor: SUDOKU_COLORS.whiteTransparent30,
      textColor: SUDOKU_COLORS.white,
    },
    
    // Blockgrenzen
    blockBorder: {
      borderColor: SUDOKU_COLORS.whiteTransparent60,
    },
    
    // Spezialisierte Zelltypen
    selected: {
      backgroundColor: SUDOKU_COLORS.whiteTransparent35,
    },
    related: {
      backgroundColor: SUDOKU_COLORS.whiteTransparent15,
    },
    sameValue: {
      backgroundColor: SUDOKU_COLORS.whiteTransparent20,
    },
    initial: {
      textColor: SUDOKU_COLORS.white,
      fontWeight: "700",
    },
    error: {
      backgroundColor: SUDOKU_COLORS.error,
      textColor: SUDOKU_COLORS.errorText,
    },
    hint: {
      backgroundColor: SUDOKU_COLORS.hint,
    },
    success: {
      backgroundColor: SUDOKU_COLORS.success,
    },
    
    // Notizen
    notes: {
      textColor: SUDOKU_COLORS.whiteTransparent85,
    },
  };
  
  // Board-Design
  export const BOARD_STYLES = {
    backgroundColor: SUDOKU_COLORS.primary,
    borderColor: SUDOKU_COLORS.whiteTransparent60,
    borderRadius: 8,
    
    // Schatten
    shadow: {
      color: SUDOKU_COLORS.shadow,
      offset: { width: 0, height: 10 },
      opacity: 0.3,
      radius: 15,
      elevation: 10,
    },
  };
  
  export default {
    SUDOKU_COLORS,
    CELL_STYLES,
    BOARD_STYLES,
  };