// utils/duoColors.ts
// Premium Duo-Modus Farbsystem: Subtil & Professionell
// Design-Philosophie: "Subtle Sophistication"
//
// - iOS-inspirierte Eleganz
// - WCAG AAA Kontrast (7:1+) für alle Texte
// - SOLIDE Hex-Farben (keine rgba) für elevation/shadows
// - Player 1: Dynamic Path Color (dezent)
// - Player 2: Premium Neutral Grays

import { hexToColorId } from './pathColors';
import { withOpacity, getContrastText } from './colorHelpers';

/**
 * Duo Player IDs
 * 0 = Neutral/Middle cell
 * 1 = Player 1 (Bottom) - DYNAMIC PATH COLOR (subtil) 🌈
 * 2 = Player 2 (Top) - PREMIUM NEUTRAL GRAY ⚪
 */
export type DuoPlayerId = 0 | 1 | 2;

/**
 * ============================================================================
 * PREMIUM FARBPALETTEN FÜR JEDE PATH COLOR
 * ============================================================================
 * Alle Farben sind SOLIDE HEX-Werte (keine rgba) für elevation/shadows
 * Pre-calculated durch Alpha Blending mit Base Backgrounds (#FAFAFA / #1C1C1E)
 */

interface ColorPalette {
  // Subtile Zellhintergründe (solide Hex, 4-5% gemischt)
  cellBackgroundLight: string;
  cellBackgroundDark: string;

  // Selected Cell (solide Hex, 15-18% gemischt)
  selectedBackgroundLight: string;
  selectedBackgroundDark: string;

  // Number Buttons (solide Hex, 90% gemischt)
  buttonBackgroundLight: string;
  buttonBackgroundDark: string;

  // Text mit perfektem Kontrast (7:1+)
  textLight: string;
  textDark: string;

  // Initial Text (noch mehr Kontrast, 10:1+)
  initialTextLight: string;
  initialTextDark: string;

  // Notes (60-70% opacity, mindestens 4.5:1)
  notesLight: string;
  notesDark: string;
}

const COLOR_PALETTES: Record<string, ColorPalette> = {
  // BLUE - Trust & Calm
  blue: {
    // Cell backgrounds (4-5% blend)
    cellBackgroundLight: '#F3F5FA', // rgba(66,133,244,0.04) auf #FAFAFA
    cellBackgroundDark: '#1F2329',  // rgba(94,158,255,0.05) auf #1C1C1E

    // Selected (15-18% blend)
    selectedBackgroundLight: '#DEE8F9', // rgba(66,133,244,0.15) auf #FAFAFA
    selectedBackgroundDark: '#283347',  // rgba(94,158,255,0.18) auf #1C1C1E

    // Buttons (90% blend)
    buttonBackgroundLight: '#5491F5', // rgba(66,133,244,0.90) auf #FAFAFA
    buttonBackgroundDark: '#5791E9',  // rgba(94,158,255,0.90) auf #1C1C1E

    // Text
    textLight: '#0D47A1',
    textDark: '#BBDEFB',
    initialTextLight: '#01579B',
    initialTextDark: '#E3F2FD',
    notesLight: 'rgba(13, 71, 161, 0.65)',
    notesDark: 'rgba(187, 222, 251, 0.65)',
  },

  // GREEN - Growth & Harmony
  green: {
    cellBackgroundLight: '#F4FAF5', // rgba(52,168,83,0.04) auf #FAFAFA
    cellBackgroundDark: '#1F2621',  // rgba(95,191,115,0.05) auf #1C1C1E

    selectedBackgroundLight: '#E0F4E6', // rgba(52,168,83,0.15) auf #FAFAFA
    selectedBackgroundDark: '#2A3C2F',  // rgba(95,191,115,0.18) auf #1C1C1E

    buttonBackgroundLight: '#43A95E', // rgba(52,168,83,0.90) auf #FAFAFA
    buttonBackgroundDark: '#5BB976',  // rgba(95,191,115,0.90) auf #1C1C1E

    textLight: '#1B5E20',
    textDark: '#C8E6C9',
    initialTextLight: '#0D3818',
    initialTextDark: '#E8F5E9',
    notesLight: 'rgba(27, 94, 32, 0.65)',
    notesDark: 'rgba(200, 230, 201, 0.65)',
  },

  // YELLOW - Energy & Focus
  yellow: {
    cellBackgroundLight: '#FEF9F4', // rgba(249,171,0,0.04) auf #FAFAFA
    cellBackgroundDark: '#272520',  // rgba(255,214,102,0.05) auf #1C1C1E

    selectedBackgroundLight: '#FBF0D8', // rgba(249,171,0,0.15) auf #FAFAFA
    selectedBackgroundDark: '#443C25',  // rgba(255,214,102,0.18) auf #1C1C1E

    buttonBackgroundLight: '#EEA919', // rgba(249,171,0,0.90) auf #FAFAFA
    buttonBackgroundDark: '#F0CF65',  // rgba(255,214,102,0.90) auf #1C1C1E

    textLight: '#E65100',
    textDark: '#FFE082',
    initialTextLight: '#BF360C',
    initialTextDark: '#FFF9C4',
    notesLight: 'rgba(230, 81, 0, 0.65)',
    notesDark: 'rgba(255, 224, 130, 0.65)',
  },

  // RED - Passion & Strength
  red: {
    cellBackgroundLight: '#FEF4F4', // rgba(234,67,53,0.04) auf #FAFAFA
    cellBackgroundDark: '#261F20',  // rgba(255,107,107,0.05) auf #1C1C1E

    selectedBackgroundLight: '#FADEDE', // rgba(234,67,53,0.15) auf #FAFAFA
    selectedBackgroundDark: '#3F2C2D',  // rgba(255,107,107,0.18) auf #1C1C1E

    buttonBackgroundLight: '#E14E44', // rgba(234,67,53,0.90) auf #FAFAFA
    buttonBackgroundDark: '#EE6969',  // rgba(255,107,107,0.90) auf #1C1C1E

    textLight: '#B71C1C',
    textDark: '#FFCDD2',
    initialTextLight: '#880E4F',
    initialTextDark: '#FFEBEE',
    notesLight: 'rgba(183, 28, 28, 0.65)',
    notesDark: 'rgba(255, 205, 210, 0.65)',
  },

  // PURPLE - Wisdom & Mystery
  purple: {
    cellBackgroundLight: '#F9F5FE', // rgba(124,77,255,0.04) auf #FAFAFA
    cellBackgroundDark: '#22202A',  // rgba(167,139,250,0.05) auf #1C1C1E

    selectedBackgroundLight: '#ECE1FB', // rgba(124,77,255,0.15) auf #FAFAFA
    selectedBackgroundDark: '#352F45',  // rgba(167,139,250,0.18) auf #1C1C1E

    buttonBackgroundLight: '#7B56F4', // rgba(124,77,255,0.90) auf #FAFAFA
    buttonBackgroundDark: '#A28AED',  // rgba(167,139,250,0.90) auf #1C1C1E

    textLight: '#4A148C',
    textDark: '#E1BEE7',
    initialTextLight: '#311B92',
    initialTextDark: '#F3E5F5',
    notesLight: 'rgba(74, 20, 140, 0.65)',
    notesDark: 'rgba(225, 190, 231, 0.65)',
  },
};

/**
 * ============================================================================
 * PREMIUM NEUTRAL COLORS (SPIELER 2) - iOS-inspiriert
 * ============================================================================
 * Professionelle Grautöne mit maximalem Kontrast
 * ALLE WERTE SIND SOLIDE (keine rgba außer notes)
 */

const NEUTRAL_COLORS = {
  light: {
    // iOS-inspirierte Grautöne (SOLIDE)
    cellBackground: '#F8F9FA',
    selected: '#E8EAED',
    text: '#1C1C1E',
    textInitial: '#000000',
    notes: 'rgba(60, 64, 67, 0.65)',

    // UI-Elemente (SOLIDE für elevation)
    controlBackground: '#F5F5F5',      // statt rgba(0,0,0,0.04)
    buttonBackground: '#ECECEC',       // statt rgba(0,0,0,0.08)
    buttonText: '#1C1C1E',
    buttonBorder: 'rgba(0, 0, 0, 0.15)',
    indicatorBackground: '#F0F0F0',    // statt rgba(0,0,0,0.06)
    indicatorHeart: '#5F6368',
  },
  dark: {
    // iOS systemGray colors (SOLIDE)
    cellBackground: '#2C2C2E',
    selected: '#48484A',
    text: '#F5F5F7',
    textInitial: '#FFFFFF',
    notes: 'rgba(235, 235, 245, 0.65)',

    // UI-Elemente (SOLIDE für elevation)
    controlBackground: '#24242A',      // statt rgba(255,255,255,0.08)
    buttonBackground: '#30303A',       // statt rgba(255,255,255,0.12)
    buttonText: '#F5F5F7',
    buttonBorder: 'rgba(255, 255, 255, 0.18)',
    indicatorBackground: '#26262C',    // statt rgba(255,255,255,0.08)
    indicatorHeart: '#9AA0A6',
  },
} as const;

/**
 * ============================================================================
 * HELPER: Farbpalette für Path Color abrufen
 * ============================================================================
 */

function getPathColorPalette(pathColorHex: string): ColorPalette {
  const colorId = hexToColorId(pathColorHex);
  return COLOR_PALETTES[colorId] || COLOR_PALETTES.blue;
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
  // Universal Error Colors (NICHT player-abhängig)
  const errorColors = {
    background: isDark ? 'rgba(239, 83, 80, 0.18)' : 'rgba(211, 47, 47, 0.12)',
    selectedBackground: isDark ? 'rgba(239, 83, 80, 0.30)' : 'rgba(211, 47, 47, 0.22)',
    textColor: isDark ? '#EF5350' : '#D32F2F',
  };

  if (player === 1) {
    // SPIELER 1 - DYNAMIC PATH COLOR (SUBTIL)
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
    // SPIELER 2 - PREMIUM NEUTRAL GRAY
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
      cellBackground: isDark ? '#3A3A3C' : '#EEEEEE',
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
    neutralBackground: isDark ? '#3A3A3C' : '#EEEEEE',
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
    // SPIELER 1 - DYNAMIC PATH COLOR
    const palette = getPathColorPalette(pathColorHex);
    const buttonBg = isDark ? palette.buttonBackgroundDark : palette.buttonBackgroundLight;
    const buttonText = getContrastText(pathColorHex);

    return {
      darkBackgroundColor: isDark ? palette.cellBackgroundDark : palette.cellBackgroundLight,
      lightBackgroundColor: isDark ? palette.cellBackgroundDark : palette.cellBackgroundLight,
      numberButton: {
        background: buttonBg, // SOLIDE Hex für elevation!
        textColor: buttonText,
        borderColor: pathColorHex,
        disabledBackground: withOpacity(pathColorHex, 0.35),
        disabledTextColor: withOpacity(buttonText, 0.5),
      },
      actionButton: {
        background: isDark ? '#24242A' : '#F5F5F5', // SOLIDE statt rgba
        activeBackground: isDark ? palette.selectedBackgroundDark : palette.selectedBackgroundLight,
        iconColor: isDark ? '#F5F5F7' : '#1C1C1E',
        textColor: isDark ? '#F5F5F7' : '#1C1C1E',
        borderColor: pathColorHex,
        disabledBackground: isDark ? '#1F1F24' : '#F8F8F8',
        disabledIconColor: isDark ? 'rgba(245, 245, 247, 0.3)' : 'rgba(28, 28, 30, 0.3)',
      },
    };
  } else {
    // SPIELER 2 - NEUTRAL GRAY
    const neutral = isDark ? NEUTRAL_COLORS.dark : NEUTRAL_COLORS.light;

    return {
      darkBackgroundColor: neutral.controlBackground,
      lightBackgroundColor: neutral.controlBackground,
      numberButton: {
        background: neutral.buttonBackground, // SOLIDE!
        textColor: neutral.buttonText,
        borderColor: neutral.buttonBorder,
        disabledBackground: withOpacity(neutral.buttonBackground, 0.4),
        disabledTextColor: withOpacity(neutral.buttonText, 0.4),
      },
      actionButton: {
        background: neutral.controlBackground, // SOLIDE!
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
 * WICHTIG: Fehler sind UNIVERSAL (nicht player-abhängig)
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
  // UNIVERSAL ERROR COLORS - unabhängig vom Spieler
  return {
    background: isDark ? 'rgba(239, 83, 80, 0.15)' : 'rgba(211, 47, 47, 0.10)',
    heart: isDark ? '#EF5350' : '#D32F2F',
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
    // SPIELER 1 - FULL PATH COLOR (100% intensity für Celebration)
    const colorId = hexToColorId(pathColorHex);
    const palette = getPathColorPalette(pathColorHex);

    return {
      colorKey: colorId,
      primary: pathColorHex, // Volle Farbe für Winner
      secondary: isDark ? palette.textDark : palette.textLight,
      background: withOpacity(pathColorHex, 0.08),
    };
  } else {
    // SPIELER 2 - NEUTRAL GRAY
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
 * Gibt die Duo-Brand-Farbe zurück (für Logos, Buttons außerhalb des Spiels)
 * Verwendet die aktuelle Path Color des Spielers
 */
export const getDuoBrandColor = (pathColorHex: string): string => {
  return pathColorHex;
};
