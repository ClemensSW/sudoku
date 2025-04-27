// utils/theme/colors.ts - Vollständig TypeScript-kompatibel

// Light Theme
const lightColors = {
  // Primary Colors
  primary: "#4285F4",       // Google-Blau: universal ansprechend
  primaryLight: "#D2E3FC",  // Sanftes Hellblau
  primaryDark: "#1967D2",   // Tieferes Blau für Kontraste
  secondary: "#EA4335",     // Gedecktes Rot für Akzente
  
  // UI Elements
  background: "#F8F9FA",    // Leicht getöntes Off-White
  surface: "#FFFFFF",       // Reines Weiß
  card: "#FFFFFF",          
  boardBackground: "#F1F3F4", 

  // Board (wichtig für Sudoku-Komponenten)
  boardBackgroundColor: "#F1F3F4",
  boardGridLineColor: "rgba(60, 64, 67, 0.15)", 
  boardBorderColor: "rgba(60, 64, 67, 0.25)",
  boardCellBorderColor: "rgba(60, 64, 67, 0.08)",

  // Neue Cell Colors für SudokuCell
  cellSelectedBackground: "#4285F4",
  cellRelatedBackground: "rgba(66, 133, 244, 0.08)",
  cellErrorBackground: "rgba(217, 48, 37, 0.08)",
  cellHintBackground: "rgba(251, 188, 5, 0.12)",
  cellSuccessBackground: "rgba(52, 168, 83, 0.08)",
  cellTextColor: "#202124",
  cellInitialTextColor: "#1967D2",
  cellSelectedTextColor: "#FFFFFF",
  cellErrorTextColor: "#D93025",
  cellSameValueTextColor: "#1967D2",
  cellNotesTextColor: "rgba(60, 64, 67, 0.75)",

  // Grid
  gridLine: "#E8EAED",
  gridBold: "#DADCE0",

  // Text
  textPrimary: "#202124",
  textSecondary: "#5F6368",
  textLight: "#80868B",
  textOnPrimary: "#FFFFFF",
  textCellNormal: "#202124",
  textCellInitial: "#1967D2",
  textCellSelected: "#FFFFFF",
  textCellError: "#D93025",
  textCellNotes: "#5F6368",

  // UI elements
  button: "#4285F4",
  buttonText: "#FFFFFF",
  buttonDisabled: "#E8EAED",
  buttonTextDisabled: "#9AA0A6",
  buttonSuccess: "#34A853",
  buttonDanger: "#EA4335",

  // Status colors
  success: "#34A853",
  error: "#EA4335",
  warning: "#FBBC05",
  info: "#4285F4",

  // Misc
  border: "#DADCE0",
  divider: "#E8EAED",
  shadow: "rgba(60, 64, 67, 0.10)",
  overlay: "rgba(60, 64, 67, 0.6)",
  backdropColor: "rgba(248, 249, 250, 0.95)",

  // Number pad
  numberPadButton: "#F1F3F4",
  numberPadButtonText: "#202124",
  numberPadButtonSelected: "#4285F4",
  numberPadButtonTextSelected: "#FFFFFF"
};

// Dark Theme
const darkColors = {
  // Primary Colors
  primary: "#8AB4F8",
  primaryLight: "#AECBFA",
  primaryDark: "#4285F4",
  secondary: "#F6AEA9",
  
  // UI Elements
  background: "#202124",
  surface: "#292A2D",
  card: "#35363A",
  boardBackground: "#292A2D",

  // Board (wichtig für Sudoku-Komponenten)
  boardBackgroundColor: "#292A2D",
  boardGridLineColor: "rgba(232, 234, 237, 0.12)",
  boardBorderColor: "rgba(232, 234, 237, 0.20)",
  boardCellBorderColor: "rgba(232, 234, 237, 0.08)",

  // Neue Cell Colors für SudokuCell
  cellSelectedBackground: "#4285F4",
  cellRelatedBackground: "rgba(138, 180, 248, 0.12)",
  cellErrorBackground: "rgba(242, 139, 130, 0.18)",
  cellHintBackground: "#rgba(250, 209, 101, 0.16)",
  cellSuccessBackground: "rgba(129, 201, 149, 0.15)",
  cellTextColor: "#E8EAED",
  cellInitialTextColor: "#AECBFA",
  cellSelectedTextColor: "#202124",
  cellErrorTextColor: "#F28B82",
  cellSameValueTextColor: "#8AB4F8",
  cellNotesTextColor: "rgba(232, 234, 237, 0.7)",

  // Grid
  gridLine: "#3C4043",
  gridBold: "#5F6368",

  // Text
  textPrimary: "#E8EAED",
  textSecondary: "#9AA0A6",
  textLight: "#80868B",
  textOnPrimary: "#202124",
  textCellNormal: "#E8EAED",
  textCellInitial: "#AECBFA",
  textCellSelected: "#202124",
  textCellError: "#F28B82",
  textCellNotes: "#9AA0A6",

  // UI elements
  button: "#8AB4F8",
  buttonText: "#202124",
  buttonDisabled: "#3C4043",
  buttonTextDisabled: "#9AA0A6",
  buttonSuccess: "#81C995",
  buttonDanger: "#F28B82",

  // Status colors
  success: "#81C995",
  error: "#F28B82",
  warning: "#FAD165",
  info: "#8AB4F8",

  // Misc
  border: "#5F6368",
  divider: "#3C4043",
  shadow: "rgba(0, 0, 0, 0.3)",
  overlay: "rgba(0, 0, 0, 0.6)",
  backdropColor: "rgba(32, 33, 36, 0.92)",

  // Number pad
  numberPadButton: "#35363A",
  numberPadButtonText: "#E8EAED",
  numberPadButtonSelected: "#8AB4F8",
  numberPadButtonTextSelected: "#202124"
};

// Export theme based on system preference or user selection
export const colors = {
  light: lightColors,
  dark: darkColors,
};

export default colors;