// utils/theme/colors.ts - Vollständig TypeScript-kompatibel

import { hexToColorId, PathColorId } from '@/utils/pathColors';

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
  cellTextColor: "#1A2C42",
  cellInitialTextColor: "#10253E",
  cellSelectedTextColor: "#FFFFFF",
  cellErrorTextColor: "#D93025",
  cellSameValueTextColor: "#4285F4",
  cellNotesTextColor: "rgba(60, 64, 67, 0.75)",

  // Opake Zellfarben für Gap-Layout (Alpha-Blending vorberechnet)
  cellCheckerboardBackground: "#E8EAF0",  // Fallback für dunkle Schachbrett-Boxen
  cellCheckerboardLightBackground: "#FFFFFF",  // Helle Schachbrett-Boxen (reines Weiß)

  // Schachbrett-Farben (Path-Color-getönt, ~12% auf Hellgrau #EDEFF0 - heller & farbiger)
  cellCheckerBlue: "#D9E2F0",        // Hellgrau + Blue @ 12%
  cellCheckerGreen: "#D7E6DD",       // Hellgrau + Green @ 12%
  cellCheckerYellow: "#EFE7D3",      // Hellgrau + Yellow @ 12%
  cellCheckerRed: "#EDDADA",         // Hellgrau + Red @ 12%
  cellCheckerPurple: "#E0DCF2",      // Hellgrau + Purple @ 12%

  // Related Highlights (25% opacity) - kräftiger für Kontrast zu Gap-Farben
  cellRelatedBlue: "#C5D8F4",     // #F1F3F4 + #4285F4 @ 25%
  cellRelatedGreen: "#C2E0CC",    // #F1F3F4 + #34A853 @ 25%
  cellRelatedYellow: "#F3E1B7",   // #F1F3F4 + #F9AB00 @ 25%
  cellRelatedRed: "#EFC7C4",      // #F1F3F4 + #EA4335 @ 25%
  cellRelatedPurple: "#D4CAF7",   // #F1F3F4 + #7C4DFF @ 25%

  // Gap-Farben (Path-Color-getönt, ~20% auf Dunkelgrau #C8CACC - dunkler als Related)
  gapColorBlue: "#ADBCD4",        // Dunkelgrau + Blue @ 20%
  gapColorGreen: "#AAC3B4",       // Dunkelgrau + Green @ 20%
  gapColorYellow: "#D2C4A3",      // Dunkelgrau + Yellow @ 20%
  gapColorRed: "#CFAFAE",         // Dunkelgrau + Red @ 20%
  gapColorPurple: "#B9B1D6",      // Dunkelgrau + Purple @ 20%

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
  purple: "#9334A8",     // Violett/Lila

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
  numberPadButtonTextSelected: "#FFFFFF",

  // Theme Toggle (warme Farben für Light Mode)
  themeToggleTrack: "rgba(0, 0, 0, 0.06)",
  themeToggleGradientStart: "#FF8C42",
  themeToggleGradientEnd: "#FFD93D",
  themeToggleThumb: "#FFFFFF",
  themeToggleInactiveIcon: "rgba(0, 0, 0, 0.3)"
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
  cellTextColor: "#FFFFFF",
  cellInitialTextColor: "#FFFFFF",
  cellSelectedTextColor: "#FFFFFF",
  cellErrorTextColor: "#F28B82",
  cellSameValueTextColor: "#8AB4F8",
  cellNotesTextColor: "rgba(232, 234, 237, 0.7)",

  // Opake Zellfarben für Gap-Layout (Alpha-Blending vorberechnet)
  cellCheckerboardBackground: "#1E2022",  // Fallback für dunkle Schachbrett-Boxen (sehr dunkel)
  cellCheckerboardLightBackground: "#212224",  // Helle Schachbrett-Boxen (dunkler als Board)

  // Schachbrett-Farben (Path-Color-getönt, ~6% auf Dunkelgrau #1E2022 - sehr dunkel)
  cellCheckerBlue: "#24292F",        // Dunkelgrau + Blue @ 6%
  cellCheckerGreen: "#222A27",       // Dunkelgrau + Green @ 6%
  cellCheckerYellow: "#2C2B26",      // Dunkelgrau + Yellow @ 6%
  cellCheckerRed: "#2C2526",         // Dunkelgrau + Red @ 6%
  cellCheckerPurple: "#26262F",      // Dunkelgrau + Purple @ 6%

  // Related Highlights (25% opacity) - kräftiger für Kontrast zu Gap-Farben
  cellRelatedBlue: "#3E4D60",     // #292A2D + #7EB5F7 @ 25%
  cellRelatedGreen: "#374F3E",    // #292A2D + #5FBF73 @ 25%
  cellRelatedYellow: "#5F553B",   // #292A2D + #FFD666 @ 25%
  cellRelatedRed: "#5F3A3C",      // #292A2D + #FF6B6B @ 25%
  cellRelatedPurple: "#494260",   // #292A2D + #A78BFA @ 25%

  // Gap-Farben (Path-Color-getönt, ~15% auf Dunkelgrau - subtiler)
  gapColorBlue: "#3A4048",        // Dunkelgrau + Blue @ 15%
  gapColorGreen: "#38433C",       // Dunkelgrau + Green @ 15%
  gapColorYellow: "#46423A",      // Dunkelgrau + Yellow @ 15%
  gapColorRed: "#463A3A",         // Dunkelgrau + Red @ 15%
  gapColorPurple: "#403E48",      // Dunkelgrau + Purple @ 15%

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
  numberPadButtonTextSelected: "#202124",

  // Theme Toggle (kühle Farben für Dark Mode)
  themeToggleTrack: "rgba(255, 255, 255, 0.08)",
  themeToggleGradientStart: "#2D3561",
  themeToggleGradientEnd: "#8A78B4",
  themeToggleThumb: "#FFFFFF",
  themeToggleInactiveIcon: "rgba(255, 255, 255, 0.4)"
};

// Export theme based on system preference or user selection
export const colors = {
  light: lightColors,
  dark: darkColors,
};

/**
 * Gibt die vordefinierte Related-Hintergrundfarbe für eine Path-Farbe zurück
 * Verwendet opake Farben statt Transparenzwerte für Gap-Layout-Kompatibilität
 */
export const getRelatedBackgroundColor = (
  pathColorHex: string,
  isDark: boolean
): string => {
  const colorId = hexToColorId(pathColorHex);
  const colorMap = isDark ? darkColors : lightColors;

  const relatedColors: Record<PathColorId, string> = {
    blue: colorMap.cellRelatedBlue,
    green: colorMap.cellRelatedGreen,
    yellow: colorMap.cellRelatedYellow,
    red: colorMap.cellRelatedRed,
    purple: colorMap.cellRelatedPurple,
  };

  return relatedColors[colorId] || colorMap.cellRelatedBlue;
};

/**
 * Gibt die Path-Color-getönte Gap-Farbe für Grid-Linien zurück
 */
export const getGapColor = (
  pathColorHex: string,
  isDark: boolean
): string => {
  const colorId = hexToColorId(pathColorHex);
  const colorMap = isDark ? darkColors : lightColors;

  const gapColors: Record<PathColorId, string> = {
    blue: colorMap.gapColorBlue,
    green: colorMap.gapColorGreen,
    yellow: colorMap.gapColorYellow,
    red: colorMap.gapColorRed,
    purple: colorMap.gapColorPurple,
  };

  return gapColors[colorId] || colorMap.gapColorBlue;
};

/**
 * Gibt die Path-Color-getönte Schachbrett-Farbe für die dunkleren Boxen zurück
 */
export const getCheckerboardColor = (
  pathColorHex: string,
  isDark: boolean
): string => {
  const colorId = hexToColorId(pathColorHex);
  const colorMap = isDark ? darkColors : lightColors;

  const checkerColors: Record<PathColorId, string> = {
    blue: colorMap.cellCheckerBlue,
    green: colorMap.cellCheckerGreen,
    yellow: colorMap.cellCheckerYellow,
    red: colorMap.cellCheckerRed,
    purple: colorMap.cellCheckerPurple,
  };

  return checkerColors[colorId] || colorMap.cellCheckerBlue;
};

export default colors;