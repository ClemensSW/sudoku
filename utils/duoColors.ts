// utils/duoColors.ts
// Duo Mode Farbsystem: "Unified Professional"
// Design-Philosophie: Wie das normale Sudoku Game, nur mit subtilen Zonen
//
// Kern-Prinzipien:
// 1. Nutzt Theme Colors aus colors.ts (maximal konsistent)
// 2. Beide Spieler absolut gleichwertig (identische Controls)
// 3. Klare Trennung durch Stepped-Divider und Zone-Farben
// 4. Path Color nur für funktionale States (selected), nicht für Dekoration
// 5. Professionell & zurückhaltend - Fokus auf Gameplay
// 6. Gap-basiertes Layout mit opaken Farben (wie Single-Player)

import { colors, getDuoZoneBackground } from '@/utils/theme/colors';
import { mixColors } from './colorHelpers';

export type DuoPlayerId = 0 | 1 | 2;

/**
 * Gibt die Trennlinien-Farbe mit leichter Transparenz zurück
 * Damit die Linie nicht zu dominant wirkt
 */
export function getDividerColor(pathColorHex: string): string {
  // 70% Opacity (B3 in Hex) für dezentere Trennlinie
  return pathColorHex + '80';
}

/**
 * Berechnet ob und welche Borders eine Zelle für die Zonen-Trennlinie braucht
 * Die Trennlinie verläuft stufenförmig durch die Mitte des Spielfelds:
 * - Unter Row 4: cols 0-3 (STOPPT vor neutraler Zelle)
 * - Unter Row 3: cols 5-8 (BEGINNT nach neutraler Zelle)
 * - Die neutrale Zelle (4,4) bleibt frei als "Insel"
 */
export function getZoneDividerBorders(row: number, col: number): {
  top?: boolean;
  right?: boolean;
  bottom?: boolean;
  left?: boolean;
} {
  // Unter Row 4: cols 0-3 (linke Linie stoppt VOR der neutralen Zelle)
  if (row === 4 && col >= 0 && col <= 3) {
    return { bottom: true };
  }
  // Unter Row 3: cols 5-8 (rechte Linie beginnt NACH der neutralen Zelle)
  if (row === 3 && col >= 5 && col <= 8) {
    return { bottom: true };
  }
  return {};
}

/**
 * Cell Colors - nutzt opake Farben aus colors.ts für Gap-Layout-Kompatibilität
 * Player 1 Zone: Subtiler Path Color Tint (4%)
 * Player 2 Zone: Neutral grau
 * Schachbrett: Path-Color-getönt für P1, neutral für P2
 *
 * @param isCheckerboard - Ob die Zelle in einer Schachbrett-Box ist (boxRow + boxCol) % 2 === 1
 */
export const getPlayerCellColors = (
  player: DuoPlayerId,
  pathColorHex: string,
  isDark: boolean,
  isCheckerboard: boolean = false
) => {
  const themeColors = isDark ? colors.dark : colors.light;

  // Verwende opake Farben aus colors.ts für Gap-Layout-Kompatibilität
  const cellBackground = getDuoZoneBackground(player, pathColorHex, isDark, isCheckerboard);

  return {
    // Cell backgrounds - opake Farben für Gap-Layout
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
 * Board Colors - Opake Farben für Gap-Layout
 * Player 1: 4% Path Color Tint
 * Player 2: Neutral grau
 * Kein Gradient mehr - klare Trennung durch Divider und Zellfarben
 */
export const getDuoBoardColors = (pathColorHex: string, isDark: boolean) => {
  return {
    // Zonen-Hintergründe - nutzen opake Farben aus getDuoZoneBackground
    player1Background: getDuoZoneBackground(1, pathColorHex, isDark, false),
    player2Background: getDuoZoneBackground(2, pathColorHex, isDark, false),
    neutralBackground: getDuoZoneBackground(0, pathColorHex, isDark, false),
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
