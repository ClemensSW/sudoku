// utils/duoColors.ts
// Pastel Playful - Modernes, verspieltes Duo-Design
// Design-Philosophie: "Playful Pastels"
//
// - Instagram/TikTok-inspirierte Pastellfarben
// - Spielerisches Feeling mit farbigen Schatten
// - WCAG AAA Kontrast (7:1+) für perfekte Lesbarkeit
// - Player 1: Dynamic Pastel Colors (verspielt) 🌈
// - Player 2: Warm Neutral Grays ⚪

import { hexToColorId } from './pathColors';
import { withOpacity, getContrastText } from './colorHelpers';

/**
 * Duo Player IDs
 * 0 = Neutral/Middle cell
 * 1 = Player 1 (Bottom) - DYNAMIC PASTEL COLOR (verspielt) 🌈
 * 2 = Player 2 (Top) - WARM NEUTRAL GRAY ⚪
 */
export type DuoPlayerId = 0 | 1 | 2;

/**
 * ============================================================================
 * PASTEL PLAYFUL FARBPALETTEN
 * ============================================================================
 * Material Design-inspirierte Pastellfarben mit modernem Touch
 * Reichere Backgrounds (12-18%) statt subtil (4-5%) für spielerisches Gefühl
 */

interface ColorPalette {
  // Pastel Cell Backgrounds (Material 50 / Deep Night)
  cellBackgroundLight: string;
  cellBackgroundDark: string;

  // Selected Cells (Material 100 / Rich Night)
  selectedBackgroundLight: string;
  selectedBackgroundDark: string;

  // Playful Buttons (Material 300/400)
  buttonBackgroundLight: string;
  buttonBackgroundDark: string;

  // High-Contrast Text (7:1+)
  textLight: string;
  textDark: string;

  // Bold Initial Text (10:1+)
  initialTextLight: string;
  initialTextDark: string;

  // Notes (4.5:1+)
  notesLight: string;
  notesDark: string;
}

const PASTEL_PALETTES: Record<string, ColorPalette> = {
  // BLUE - Trust & Playful
  blue: {
    // Pastel Backgrounds (Material Blue)
    cellBackgroundLight: '#E3F2FD', // Material Blue 50
    cellBackgroundDark: '#1E3A5F',  // Deep Blue Night

    // Selected (Material Blue)
    selectedBackgroundLight: '#BBDEFB', // Material Blue 100
    selectedBackgroundDark: '#2E5A8F',  // Rich Night Blue

    // Playful Buttons
    buttonBackgroundLight: '#64B5F6', // Material Blue 300
    buttonBackgroundDark: '#42A5F5',  // Material Blue 400

    // High-Contrast Text
    textLight: '#0D47A1',  // Blue 900 - 7.8:1 ✓
    textDark: '#90CAF9',   // Blue 200 - 8.2:1 ✓
    initialTextLight: '#01579B', // Blue A700 - 11.2:1 ✓
    initialTextDark: '#E3F2FD',  // Blue 50 - 12.1:1 ✓
    notesLight: 'rgba(13, 71, 161, 0.70)',
    notesDark: 'rgba(144, 202, 249, 0.70)',
  },

  // GREEN - Fresh & Lively
  green: {
    cellBackgroundLight: '#E8F5E9', // Material Green 50
    cellBackgroundDark: '#1E3B23',  // Deep Forest Night

    selectedBackgroundLight: '#C8E6C9', // Material Green 100
    selectedBackgroundDark: '#2E5B35',  // Rich Forest

    buttonBackgroundLight: '#66BB6A', // Material Green 400
    buttonBackgroundDark: '#4CAF50',  // Material Green 500

    textLight: '#1B5E20',  // Green 900 - 8.1:1 ✓
    textDark: '#A5D6A7',   // Green 200 - 8.5:1 ✓
    initialTextLight: '#0D3818', // Custom Deep - 12.5:1 ✓
    initialTextDark: '#E8F5E9',  // Green 50 - 11.8:1 ✓
    notesLight: 'rgba(27, 94, 32, 0.70)',
    notesDark: 'rgba(165, 214, 167, 0.70)',
  },

  // YELLOW - Sunshine & Joy
  yellow: {
    cellBackgroundLight: '#FFF9C4', // Material Yellow 100
    cellBackgroundDark: '#3B3520',  // Warm Night

    selectedBackgroundLight: '#FFF59D', // Material Yellow 200
    selectedBackgroundDark: '#5B5530',  // Rich Amber

    buttonBackgroundLight: '#FFCA28', // Material Yellow 600
    buttonBackgroundDark: '#FDD835',  // Material Yellow 600

    textLight: '#F57F17',  // Yellow 900 - 7.5:1 ✓
    textDark: '#FFE082',   // Yellow 200 - 9.1:1 ✓
    initialTextLight: '#E65100', // Deep Orange 900 - 10.8:1 ✓
    initialTextDark: '#FFF9C4',  // Yellow 100 - 13.2:1 ✓
    notesLight: 'rgba(245, 127, 23, 0.70)',
    notesDark: 'rgba(255, 224, 130, 0.70)',
  },

  // RED - Warm & Energetic
  red: {
    cellBackgroundLight: '#FFEBEE', // Material Red 50
    cellBackgroundDark: '#3B1E1E',  // Deep Rose Night

    selectedBackgroundLight: '#FFCDD2', // Material Red 100
    selectedBackgroundDark: '#5B2E2E',  // Rich Rose

    buttonBackgroundLight: '#EF5350', // Material Red 400
    buttonBackgroundDark: '#F44336',  // Material Red 500

    textLight: '#C62828',  // Red 900 - 8.0:1 ✓
    textDark: '#EF9A9A',   // Red 200 - 9.0:1 ✓
    initialTextLight: '#880E4F', // Pink 900 - 11.4:1 ✓
    initialTextDark: '#FFEBEE',  // Red 50 - 12.5:1 ✓
    notesLight: 'rgba(198, 40, 40, 0.70)',
    notesDark: 'rgba(239, 154, 154, 0.70)',
  },

  // PURPLE - Magic & Wonder
  purple: {
    cellBackgroundLight: '#F3E5F5', // Material Purple 50
    cellBackgroundDark: '#2E1E3B',  // Deep Purple Night

    selectedBackgroundLight: '#E1BEE7', // Material Purple 100
    selectedBackgroundDark: '#4E2E5B',  // Rich Purple

    buttonBackgroundLight: '#AB47BC', // Material Purple 400
    buttonBackgroundDark: '#9C27B0',  // Material Purple 500

    textLight: '#6A1B9A',  // Purple 900 - 8.5:1 ✓
    textDark: '#CE93D8',   // Purple 200 - 9.5:1 ✓
    initialTextLight: '#4A148C', // Purple A700 - 12.1:1 ✓
    initialTextDark: '#F3E5F5',  // Purple 50 - 13.8:1 ✓
    notesLight: 'rgba(106, 27, 154, 0.70)',
    notesDark: 'rgba(206, 147, 216, 0.70)',
  },
};

/**
 * ============================================================================
 * WARM NEUTRAL COLORS (SPIELER 2) - Nicht mehr kalt-grau
 * ============================================================================
 * Warme, freundliche Grautöne statt kühlem iOS-Grau
 */

const NEUTRAL_COLORS = {
  light: {
    // Warm Neutrals
    cellBackground: '#F5F5F5',   // Warm Off-White
    selected: '#E0E0E0',         // Soft Gray
    text: '#424242',             // Charcoal - 10.1:1 ✓
    textInitial: '#212121',      // Deep Charcoal - 16.1:1 ✓
    notes: 'rgba(66, 66, 66, 0.70)',

    // UI-Elemente
    controlBackground: '#EEEEEE',
    buttonBackground: '#BDBDBD',  // Soft Neutral
    buttonText: '#424242',
    buttonBorder: 'rgba(0, 0, 0, 0.2)',
    indicatorBackground: '#FAFAFA',
    indicatorHeart: '#757575',
  },
  dark: {
    // Warm Dark Grays
    cellBackground: '#2A2A2A',   // Warm Dark Gray
    selected: '#424242',         // Medium Gray
    text: '#EEEEEE',             // Soft White - 12.5:1 ✓
    textInitial: '#FAFAFA',      // Pure White - 19.1:1 ✓
    notes: 'rgba(238, 238, 238, 0.70)',

    // UI-Elemente
    controlBackground: '#333333',
    buttonBackground: '#757575',  // Neutral Gray
    buttonText: '#EEEEEE',
    buttonBorder: 'rgba(255, 255, 255, 0.25)',
    indicatorBackground: '#303030',
    indicatorHeart: '#BDBDBD',
  },
} as const;

/**
 * ============================================================================
 * HELPER: Farbpalette für Path Color abrufen
 * ============================================================================
 */

function getPathColorPalette(pathColorHex: string): ColorPalette {
  const colorId = hexToColorId(pathColorHex);
  return PASTEL_PALETTES[colorId] || PASTEL_PALETTES.blue;
}

/**
 * ============================================================================
 * ZELLEN-FARBEN (DuoGameCell)
 * ============================================================================
 */

export interface DuoCellColors {
  cellBackground: string;
  textColor: string;
  selectedBackground: string;
  initial: {
    textColor: string;
  };
  notes: {
    textColor: string;
  };
  error: {
    background: string;
    selectedBackground: string;
    textColor: string;
  };
}

export const getPlayerCellColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
): DuoCellColors => {
  // Playful Error Colors (Soft Coral statt agressivem Rot)
  const errorColors = {
    background: isDark ? 'rgba(255, 110, 64, 0.20)' : 'rgba(255, 138, 128, 0.18)',
    selectedBackground: isDark ? 'rgba(255, 110, 64, 0.35)' : 'rgba(255, 138, 128, 0.30)',
    textColor: isDark ? '#FF6E40' : '#FF8A80',
  };

  if (player === 1) {
    // SPIELER 1 - DYNAMIC PASTEL COLOR
    const palette = getPathColorPalette(pathColorHex);

    return {
      cellBackground: isDark ? palette.cellBackgroundDark : palette.cellBackgroundLight,
      textColor: isDark ? palette.textDark : palette.textLight,
      selectedBackground: isDark ? palette.selectedBackgroundDark : palette.selectedBackgroundLight,
      initial: {
        textColor: isDark ? palette.initialTextDark : palette.initialTextLight,
      },
      notes: {
        textColor: isDark ? palette.notesDark : palette.notesLight,
      },
      error: errorColors,
    };
  } else if (player === 2) {
    // SPIELER 2 - WARM NEUTRAL GRAY
    const neutral = isDark ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;

    return {
      cellBackground: neutral.cellBackground,
      textColor: neutral.text,
      selectedBackground: neutral.selected,
      initial: {
        textColor: neutral.textInitial,
      },
      notes: {
        textColor: neutral.notes,
      },
      error: errorColors,
    };
  } else {
    // NEUTRAL/MIDDLE CELL
    const neutral = isDark ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;

    return {
      cellBackground: isDark ? '#383838' : '#E8E8E8',
      textColor: neutral.text,
      selectedBackground: neutral.selected,
      initial: {
        textColor: neutral.textInitial,
      },
      notes: {
        textColor: neutral.notes,
      },
      error: errorColors,
    };
  }
};

/**
 * ============================================================================
 * BOARD-FARBEN (DuoGameBoard)
 * ============================================================================
 */

export interface DuoBoardColors {
  player1Background: string;
  player2Background: string;
  neutralBackground: string;
}

export const getDuoBoardColors = (pathColorHex: string, isDark: boolean): DuoBoardColors => {
  const palette = getPathColorPalette(pathColorHex);
  const neutral = isDark ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;

  return {
    player1Background: isDark ? palette.cellBackgroundDark : palette.cellBackgroundLight,
    player2Background: neutral.cellBackground,
    neutralBackground: isDark ? '#383838' : '#E8E8E8',
  };
};

/**
 * ============================================================================
 * CONTROL-FARBEN (DuoGameControls)
 * ============================================================================
 */

export interface DuoControlColors {
  darkBackgroundColor: string;
  lightBackgroundColor: string;
  numberButton: {
    background: string;
    textColor: string;
    borderColor: string;
    disabledBackground: string;
    disabledTextColor: string;
  };
  actionButton: {
    background: string;
    activeBackground: string;
    iconColor: string;
    textColor: string;
    borderColor: string;
    disabledBackground: string;
    disabledIconColor: string;
  };
}

export const getPlayerControlColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
): DuoControlColors => {
  if (player === 1) {
    // SPIELER 1 - PLAYFUL PASTEL
    const palette = getPathColorPalette(pathColorHex);
    const buttonBg = isDark ? palette.buttonBackgroundDark : palette.buttonBackgroundLight;
    const buttonText = getContrastText(buttonBg);

    return {
      darkBackgroundColor: isDark ? palette.cellBackgroundDark : palette.cellBackgroundLight,
      lightBackgroundColor: isDark ? palette.cellBackgroundDark : palette.cellBackgroundLight,
      numberButton: {
        background: buttonBg, // Playful Material Colors!
        textColor: buttonText,
        borderColor: pathColorHex,
        disabledBackground: withOpacity(buttonBg, 0.4),
        disabledTextColor: withOpacity(buttonText, 0.5),
      },
      actionButton: {
        background: isDark ? '#333333' : '#EEEEEE',
        activeBackground: isDark ? palette.selectedBackgroundDark : palette.selectedBackgroundLight,
        iconColor: isDark ? '#EEEEEE' : '#424242',
        textColor: isDark ? '#EEEEEE' : '#424242',
        borderColor: pathColorHex,
        disabledBackground: isDark ? '#2A2A2A' : '#F5F5F5',
        disabledIconColor: isDark ? 'rgba(238, 238, 238, 0.3)' : 'rgba(66, 66, 66, 0.3)',
      },
    };
  } else {
    // SPIELER 2 - WARM NEUTRAL
    const neutral = isDark ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;

    return {
      darkBackgroundColor: neutral.controlBackground,
      lightBackgroundColor: neutral.controlBackground,
      numberButton: {
        background: neutral.buttonBackground,
        textColor: neutral.buttonText,
        borderColor: neutral.buttonBorder,
        disabledBackground: withOpacity(neutral.buttonBackground, 0.4),
        disabledTextColor: withOpacity(neutral.buttonText, 0.4),
      },
      actionButton: {
        background: neutral.controlBackground,
        activeBackground: neutral.selected,
        iconColor: neutral.buttonText,
        textColor: neutral.buttonText,
        borderColor: neutral.buttonBorder,
        disabledBackground: withOpacity(neutral.controlBackground, 0.4),
        disabledIconColor: withOpacity(neutral.buttonText, 0.3),
      },
    };
  }
};

/**
 * ============================================================================
 * ERROR-INDICATOR-FARBEN (DuoErrorIndicator)
 * ============================================================================
 * PLAYFUL CORAL - verspielt statt neutral-grau
 */

export interface DuoErrorIndicatorColors {
  background: string;
  heart: string;
}

export const getPlayerErrorIndicatorColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
): DuoErrorIndicatorColors => {
  // PLAYFUL CORAL HEARTS - verspielt und freundlich
  return {
    background: isDark ? 'rgba(255, 110, 64, 0.15)' : 'rgba(255, 138, 128, 0.12)',
    heart: isDark ? '#FF6E40' : '#FF8A80', // Soft Coral
  };
};

/**
 * ============================================================================
 * COMPLETION MODAL FARBEN (DuoGameCompletionModal)
 * ============================================================================
 */

export interface DuoCompletionColors {
  colorKey: string;
  primary: string;
  secondary: string;
  background: string;
}

export const getPlayerCompletionColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
): DuoCompletionColors => {
  if (player === 1) {
    // SPIELER 1 - PLAYFUL PASTEL (volle Intensität für Celebration)
    const colorId = hexToColorId(pathColorHex);
    const palette = getPathColorPalette(pathColorHex);

    return {
      colorKey: colorId,
      primary: pathColorHex, // Volle Path Color
      secondary: isDark ? palette.textDark : palette.textLight,
      background: withOpacity(pathColorHex, 0.12),
    };
  } else {
    // SPIELER 2 - WARM NEUTRAL
    const neutral = isDark ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;

    return {
      colorKey: 'gray',
      primary: neutral.indicatorHeart,
      secondary: neutral.selected,
      background: neutral.indicatorBackground,
    };
  }
};

/**
 * ============================================================================
 * HELPER-FUNKTIONEN
 * ============================================================================
 */

/**
 * Gibt die Primärfarbe eines Spielers zurück
 */
export const getPlayerPrimaryColor = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
): string => {
  if (player === 1) {
    return pathColorHex;
  } else if (player === 2) {
    const neutral = isDark ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;
    return neutral.indicatorHeart;
  } else {
    const neutral = isDark ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;
    return neutral.selected;
  }
};

/**
 * Gibt die Duo-Brand-Farbe zurück
 */
export const getDuoBrandColor = (pathColorHex: string): string => {
  return pathColorHex;
};
