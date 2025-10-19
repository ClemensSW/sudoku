// utils/duoColors.ts
// Duo Mode Farbsystem: "Unified Professional"
// Design-Philosophie: Wie das normale Sudoku Game, nur mit subtilen Zonen
//
// Kern-Prinzipien:
// 1. Nutzt Theme Colors aus colors.ts (maximal konsistent)
// 2. Beide Spieler absolut gleichwertig (identische Controls)
// 3. Gradient durch Lightness-Unterschied, nicht durch Farbe
// 4. Path Color nur für funktionale States (selected), nicht für Dekoration
// 5. Professionell & zurückhaltend - Fokus auf Gameplay

import { colors } from '@/utils/theme/colors';
import { mixColors } from './colorHelpers';

export type DuoPlayerId = 0 | 1 | 2;

/**
 * Generiert subtile Zone Colors durch Lightness-Mixing
 * 3% Unterschied zwischen Zonen - kaum sichtbar, aber vorhanden
 */
function getZoneColors(isDark: boolean) {
  const baseLight = colors.light.surface;    // #FFFFFF
  const baseDark = colors.dark.surface;      // #292A2D

  if (isDark) {
    return {
      // Player 1 (unten): Standard Dark Background
      player1Background: baseDark,  // #292A2D
      // Player 2 (oben): 3% heller für subtile Unterscheidung
      player2Background: mixColors(baseDark, '#FFFFFF', 3), // ~#2E2F32
      // Middle/Neutral: Zwischen beiden
      neutralBackground: mixColors(baseDark, '#FFFFFF', 1.5), // ~#2C2D30
    };
  } else {
    return {
      // Player 1 (unten): Standard Light Background
      player1Background: baseLight, // #FFFFFF
      // Player 2 (oben): 3% dunkler für subtile Unterscheidung
      player2Background: mixColors(baseLight, '#000000', 3), // ~#F7F7F7
      // Middle/Neutral: Zwischen beiden
      neutralBackground: mixColors(baseLight, '#000000', 1.5), // ~#FBFBFB
    };
  }
}

/**
 * Cell Colors - nutzt Theme Colors + Path Color nur für Selection
 * Ownership wird durch Lightness-Gradient kommuniziert, nicht durch Farbe
 */
export const getPlayerCellColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
) => {
  const zoneColors = getZoneColors(isDark);
  const themeColors = isDark ? colors.dark : colors.light;

  // Basis: Normales Cell Background (zone-abhängig für subtilen Gradient)
  const cellBackground =
    player === 1 ? zoneColors.player1Background :
    player === 2 ? zoneColors.player2Background :
    zoneColors.neutralBackground;

  return {
    // Cell backgrounds - neutral mit subtilen Zonen-Unterschieden
    cellBackground,
    // Selected state nutzt Path Color für BEIDE Spieler (gleichwertig!)
    selectedBackground: pathColorHex,

    // Error states - exakt wie normales Game
    error: {
      background: themeColors.cellErrorBackground,
      selectedBackground: themeColors.cellErrorBackground,
      textColor: themeColors.cellErrorTextColor,
    },

    // Text colors - exakt wie normales Game
    textColor: themeColors.cellTextColor,
    initial: {
      textColor: themeColors.cellInitialTextColor,
    },
    notes: {
      textColor: themeColors.cellNotesTextColor,
    },
  };
};

/**
 * Board Colors - Gradient durch Lightness-Unterschiede
 * Kein farbiger Gradient, nur subtile Helligkeits-Variation
 */
export const getDuoBoardColors = (pathColorHex: string, isDark: boolean) => {
  const zoneColors = getZoneColors(isDark);

  return {
    // Zonen-Hintergründe für Gradient
    player1Background: zoneColors.player1Background,
    player2Background: zoneColors.player2Background,
    neutralBackground: zoneColors.neutralBackground,
  };
};

/**
 * Control Colors - BEIDE SPIELER IDENTISCH!
 * Nutzt NumberPad Styles aus normalem Game
 * Path Color nur für active states (Note Mode)
 */
export const getPlayerControlColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
) => {
  const themeColors = isDark ? colors.dark : colors.light;

  return {
    // Background - wie im normalen Game
    lightBackgroundColor: themeColors.background,
    darkBackgroundColor: themeColors.surface,

    // Number Buttons - exakt wie NumberPad im normalen Game!
    numberButton: {
      background: themeColors.numberPadButton,      // #F1F3F4 Light / #35363A Dark
      textColor: themeColors.numberPadButtonText,   // #202124 Light / #E8EAED Dark
      disabledBackground: themeColors.buttonDisabled,
      disabledTextColor: themeColors.buttonTextDisabled,
      borderColor: themeColors.border,              // Für neutralen Shadow
    },

    // Action Buttons - neutral wie Number Buttons
    actionButton: {
      background: themeColors.numberPadButton,      // Gleich wie Number Buttons!
      iconColor: themeColors.textSecondary,         // #5F6368 Light / #9AA0A6 Dark
      textColor: themeColors.textSecondary,
      disabledIconColor: themeColors.buttonTextDisabled,

      // Active state (Note Mode) - subtile Path Color Integration
      activeBackground: isDark
        ? mixColors(pathColorHex, themeColors.surface, 90)  // 10% Path Color
        : mixColors(pathColorHex, '#FFFFFF', 92),           // 8% Path Color
      activeBorderColor: pathColorHex,
    },
  };
};

/**
 * Error Indicator - neutral gray hearts
 * Red fill nur bei tatsächlichen Fehlern (wie normale UI)
 */
export const getPlayerErrorIndicatorColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
) => {
  const themeColors = isDark ? colors.dark : colors.light;

  return {
    background: 'transparent',
    // Neutral hearts (wie normale UI-Icons)
    heart: themeColors.textSecondary,       // #9AA0A6 (beide Modi)
    // Error fill - Theme error color
    heartError: themeColors.error,          // #EA4335 Light / #F28B82 Dark
  };
};

/**
 * Completion Modal Colors
 * Winner nutzt Path Color, Loser neutral
 */
export const getPlayerCompletionColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
) => {
  const themeColors = isDark ? colors.dark : colors.light;

  return {
    // Winner - Path Color (gleichwertig für beide Spieler!)
    winnerBackground: pathColorHex,
    winnerText: '#FFFFFF',

    // Loser - neutral
    loserBackground: isDark ? themeColors.surface : themeColors.background,
    loserText: themeColors.textSecondary,
  };
};

/**
 * Duo Controls (Preview) Colors
 * Neutral styles für Konsistenz
 */
export const getDuoControlColors = (isDark: boolean) => {
  const themeColors = isDark ? colors.dark : colors.light;

  return {
    iconColor: themeColors.textSecondary,
  };
};

/**
 * Game Mode Modal Colors
 * Icon colors für Duo Mode Preview
 */
export const getDuoIconColors = (pathColorHex: string, isDark: boolean) => {
  // Nutzt Path Color für Icon, aber subtil
  return {
    iconColor: pathColorHex,
  };
};
