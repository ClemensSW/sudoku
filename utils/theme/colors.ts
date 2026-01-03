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
  cellCheckerYellow: "#F2E3C8",      // Wärmer, weniger Grau
  cellCheckerRed: "#EDDADA",         // Hellgrau + Red @ 12%
  cellCheckerPurple: "#E0DCF2",      // Hellgrau + Purple @ 12%

  // Related Highlights (25% opacity auf Weiß) - hell & leuchtend
  cellRelatedBlue: "#D0E1FC",     // #FFFFFF + #4285F4 @ 25%
  cellRelatedGreen: "#CCE9D4",    // #FFFFFF + #34A853 @ 25%
  cellRelatedYellow: "#FEEABF",   // #FFFFFF + #F9AB00 @ 25%
  cellRelatedRed: "#FAD0CD",      // #FFFFFF + #EA4335 @ 25%
  cellRelatedPurple: "#DED3FF",   // #FFFFFF + #7C4DFF @ 25%

  // Gap-Farben (Path-Color-getönt, ~20% auf Dunkelgrau #C8CACC - dunkler als Related)
  gapColorBlue: "#ADBCD4",        // Dunkelgrau + Blue @ 20%
  gapColorGreen: "#AAC3B4",       // Dunkelgrau + Green @ 20%
  gapColorYellow: "#D7BE96",      // Wärmer, mehr Golden
  gapColorRed: "#CFAFAE",         // Dunkelgrau + Red @ 20%
  gapColorPurple: "#B9B1D6",      // Dunkelgrau + Purple @ 20%

  // Duo Mode Zone-Farben (Player 1 = Path-Tint, Player 2 = Neutral)
  // Player 1: 4% Path-Color auf Weiß (#FFFFFF)
  cellDuoPlayer1Blue: "#F5F8FE",         // #FFFFFF + #4285F4 @ 4%
  cellDuoPlayer1Green: "#F5FAF6",        // #FFFFFF + #34A853 @ 4%
  cellDuoPlayer1Yellow: "#FFFBF5",       // #FFFFFF + #F9AB00 @ 4%
  cellDuoPlayer1Red: "#FEF6F5",          // #FFFFFF + #EA4335 @ 4%
  cellDuoPlayer1Purple: "#F8F5FE",       // #FFFFFF + #7C4DFF @ 4%
  // Player 1 Checkerboard: Path-Color-getönt (identisch zu cellChecker* im Light Mode)
  cellDuoPlayer1CheckerBlue: "#D9E2F0",
  cellDuoPlayer1CheckerGreen: "#D7E6DD",
  cellDuoPlayer1CheckerYellow: "#F2E3C8",
  cellDuoPlayer1CheckerRed: "#EDDADA",
  cellDuoPlayer1CheckerPurple: "#E0DCF2",
  // Player 2: Neutral (identisch zu Single-Player hellen Boxen)
  cellDuoPlayer2Background: "#FFFFFF",
  // Player 2 Checkerboard: Subtiler Path-Color-Hauch (~5% auf #F0F1F3)
  cellDuoPlayer2CheckerBlue: "#E7ECF3",
  cellDuoPlayer2CheckerGreen: "#E7EDEB",
  cellDuoPlayer2CheckerYellow: "#F3EBE0",
  cellDuoPlayer2CheckerRed: "#F0E8EA",
  cellDuoPlayer2CheckerPurple: "#EAE9F4",

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

  // Related Highlights (35% opacity) - kräftiger für besseren Kontrast zu Gap-Farben
  cellRelatedBlue: "#475B74",     // #292A2D + #7EB5F7 @ 35%
  cellRelatedGreen: "#3C5E46",    // #292A2D + #5FBF73 @ 35%
  cellRelatedYellow: "#746641",   // #292A2D + #FFD666 @ 35%
  cellRelatedRed: "#744143",      // #292A2D + #FF6B6B @ 35%
  cellRelatedPurple: "#554C75",   // #292A2D + #A78BFA @ 35%

  // Gap-Farben (Path-Color-getönt, ~15% auf Dunkelgrau - subtiler)
  gapColorBlue: "#3A4048",        // Dunkelgrau + Blue @ 15%
  gapColorGreen: "#38433C",       // Dunkelgrau + Green @ 15%
  gapColorYellow: "#46423A",      // Dunkelgrau + Yellow @ 15%
  gapColorRed: "#463A3A",         // Dunkelgrau + Red @ 15%
  gapColorPurple: "#403E48",      // Dunkelgrau + Purple @ 15%

  // Duo Mode Zone-Farben (invertiertes Schachbrett: dunkel-hell-dunkel)
  // Player 1 Zone: Dunkel (cellChecker* Werte für invertiertes Pattern)
  cellDuoPlayer1Blue: "#24292F",         // cellCheckerBlue Wert
  cellDuoPlayer1Green: "#222A27",        // cellCheckerGreen Wert
  cellDuoPlayer1Yellow: "#2C2B26",       // cellCheckerYellow Wert
  cellDuoPlayer1Red: "#2C2526",          // cellCheckerRed Wert
  cellDuoPlayer1Purple: "#26262F",       // cellCheckerPurple Wert
  // Player 1 Checkerboard: Hell (ursprüngliche Zone-Werte)
  cellDuoPlayer1CheckerBlue: "#2D3038",
  cellDuoPlayer1CheckerGreen: "#2C3130",
  cellDuoPlayer1CheckerYellow: "#32312E",
  cellDuoPlayer1CheckerRed: "#322D2E",
  cellDuoPlayer1CheckerPurple: "#2F2E35",
  // Player 2: Neutral (invertiert)
  cellDuoPlayer2Background: "#1E2022",   // Dunkel (getauscht)
  // Player 2 Checkerboard: Neutral (keine Path-Color im Dark Mode)
  cellDuoPlayer2CheckerBlue: "#292A2D",
  cellDuoPlayer2CheckerGreen: "#292A2D",
  cellDuoPlayer2CheckerYellow: "#292A2D",
  cellDuoPlayer2CheckerRed: "#292A2D",
  cellDuoPlayer2CheckerPurple: "#292A2D",

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

/**
 * Gibt die Duo Mode Zone-Hintergrundfarbe zurück
 * Player 1 (unten): Path-Color-Tint
 * Player 2 (oben): Neutral
 * Player 0 (Mitte): Wie Player 1
 */
export const getDuoZoneBackground = (
  player: 0 | 1 | 2,
  pathColorHex: string,
  isDark: boolean,
  isCheckerboard: boolean
): string => {
  const colorId = hexToColorId(pathColorHex);
  const colorMap = isDark ? darkColors : lightColors;

  // Player 2 (oben) = Subtiler Path-Color-Tint im Light Mode
  if (player === 2) {
    if (isCheckerboard) {
      const checkerColors: Record<PathColorId, string> = {
        blue: colorMap.cellDuoPlayer2CheckerBlue,
        green: colorMap.cellDuoPlayer2CheckerGreen,
        yellow: colorMap.cellDuoPlayer2CheckerYellow,
        red: colorMap.cellDuoPlayer2CheckerRed,
        purple: colorMap.cellDuoPlayer2CheckerPurple,
      };
      return checkerColors[colorId] || colorMap.cellDuoPlayer2CheckerBlue;
    }
    return colorMap.cellDuoPlayer2Background;
  }

  // Player 1 (unten) und Player 0 (Mitte) = Path-Color-Tint
  if (isCheckerboard) {
    // Duo-spezifische Checker-Farben (invertiertes Pattern)
    const checkerColors: Record<PathColorId, string> = {
      blue: colorMap.cellDuoPlayer1CheckerBlue,
      green: colorMap.cellDuoPlayer1CheckerGreen,
      yellow: colorMap.cellDuoPlayer1CheckerYellow,
      red: colorMap.cellDuoPlayer1CheckerRed,
      purple: colorMap.cellDuoPlayer1CheckerPurple,
    };
    return checkerColors[colorId] || colorMap.cellDuoPlayer1CheckerBlue;
  }

  // Nicht-Checkerboard Zone Background
  const zoneColors: Record<PathColorId, string> = {
    blue: colorMap.cellDuoPlayer1Blue,
    green: colorMap.cellDuoPlayer1Green,
    yellow: colorMap.cellDuoPlayer1Yellow,
    red: colorMap.cellDuoPlayer1Red,
    purple: colorMap.cellDuoPlayer1Purple,
  };
  return zoneColors[colorId] || colorMap.cellDuoPlayer1Blue;
};

export default colors;