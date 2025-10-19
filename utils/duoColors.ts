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
import { mixColors, lightenColor } from './colorHelpers';

export type DuoPlayerId = 0 | 1 | 2;

/**
 * Generiert subtile Zone Colors mit Path Color Tints
 * Player 1: 4% Path Color Tint (farbig, aber sehr dezent)
 * Player 2: Neutral grau (keine Farbe)
 * Dark Mode: Path Color wird aufgehellt für freundlicheren, wärmeren Look
 */
function getZoneColors(isDark: boolean, pathColorHex: string) {
  const baseLight = colors.light.surface;    // #FFFFFF
  const baseDark = colors.dark.surface;      // #292A2D

  if (isDark) {
    // Path Color im Dark Mode aufhellen für freundlichen Glow-Effekt
    const lightenedPathColor = lightenColor(pathColorHex, 70); // 70% heller - sanftes Leuchten

    return {
      // Player 1 (unten): Dark Background + 4% aufgehellte Path Color
      player1Background: mixColors(lightenedPathColor, baseDark, 96), // 4% helle Path Color
      // Player 2 (oben): Neutral Dark Background (keine Farbe)
      player2Background: baseDark,  // #292A2D
      // Middle/Neutral: Zwischen beiden
      neutralBackground: mixColors(lightenedPathColor, baseDark, 98), // 2% helle Path Color
    };
  } else {
    // Light Mode bleibt unverändert - originale Path Color
    return {
      // Player 1 (unten): Light Background + 4% Path Color Tint
      player1Background: mixColors(pathColorHex, baseLight, 96), // 4% Path Color
      // Player 2 (oben): Neutral Light Background (keine Farbe)
      player2Background: baseLight, // #FFFFFF
      // Middle/Neutral: Zwischen beiden
      neutralBackground: mixColors(pathColorHex, baseLight, 98), // 2% Path Color
    };
  }
}

/**
 * Cell Colors - nutzt Theme Colors + Path Color für Selection & Zone Tint
 * Player 1 Zone: Subtiler Path Color Tint (4%)
 * Player 2 Zone: Neutral grau
 */
export const getPlayerCellColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
) => {
  const zoneColors = getZoneColors(isDark, pathColorHex);
  const themeColors = isDark ? colors.dark : colors.light;

  // Basis: Zone-abhängiger Background mit Path Color Tint für P1
  const cellBackground =
    player === 1 ? zoneColors.player1Background :   // Mit Path Color Tint
    player === 2 ? zoneColors.player2Background :   // Neutral
    zoneColors.neutralBackground;                   // Zwischen beiden

  return {
    // Cell backgrounds - P1 mit Path Color Tint, P2 neutral
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
 * Board Colors - Gradient mit subtilen Path Color Tints
 * Player 1: 4% Path Color Tint
 * Player 2: Neutral grau
 * Gradient: Fließender Übergang zwischen farbig und neutral
 */
export const getDuoBoardColors = (pathColorHex: string, isDark: boolean) => {
  const zoneColors = getZoneColors(isDark, pathColorHex);

  return {
    // Zonen-Hintergründe für Gradient
    player1Background: zoneColors.player1Background,  // Mit Path Color Tint
    player2Background: zoneColors.player2Background,  // Neutral
    neutralBackground: zoneColors.neutralBackground,  // Zwischen beiden
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

/**
 * Duo Brand Color
 * Gibt die Path Color für Duo Mode zurück (beide Spieler gleichwertig)
 */
export const getDuoBrandColor = (pathColorHex: string): string => {
  // Im Unified Professional Design nutzen beide Spieler die Path Color gleichwertig
  return pathColorHex;
};

/**
 * Player Primary Color für Preview/Controls
 * Beide Spieler nutzen neutrale numberPadButton Farbe (gleichwertig)
 */
export const getPlayerPrimaryColor = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean
): string => {
  const themeColors = isDark ? colors.dark : colors.light;
  // Beide Spieler bekommen die gleiche neutrale Farbe (wie NumberPad)
  return themeColors.numberPadButton;  // #F1F3F4 Light / #35363A Dark
};
