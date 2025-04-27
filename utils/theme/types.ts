// utils/theme/types.ts
import { ColorValue } from "react-native";

// Farbpalette
export interface ThemeColors {
  // Primary colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string; // Added secondary color

  // UI elements
  background: string;
  surface: string;
  card: string;
  boardBackground: string;

  // Board (neue Eigenschaften für SudokuBoard)
  boardBackgroundColor: string;
  boardBorderColor: string;
  boardGridLineColor: string;
  boardCellBorderColor: string;

  
  // Neue Zellenfarben für SudokuCell
  cellSelectedBackground: string;
  cellRelatedBackground: string;
  cellErrorBackground: string;
  cellHintBackground: string;
  cellSuccessBackground: string;
  cellTextColor: string;
  cellInitialTextColor: string;
  cellSelectedTextColor: string;
  cellErrorTextColor: string;
  cellSameValueTextColor: string;
  cellNotesTextColor: string;

  // Grid
  gridLine: string;
  gridBold: string;

  // Text
  textPrimary: string;
  textSecondary: string;
  textLight: string;
  textOnPrimary: string;
  textCellNormal: string;
  textCellInitial: string;
  textCellSelected: string;
  textCellError: string;
  textCellNotes: string;

  // UI elements
  button: string;
  buttonText: string;
  buttonDisabled: string;
  buttonTextDisabled: string;
  buttonSuccess: string;
  buttonDanger: string;

  // Status colors
  success: string;
  error: string;
  warning: string;
  info: string;

  // Misc
  border: string;
  divider: string;
  shadow: string;
  overlay: string;
  backdropColor: string; // Hinzugefügt für Modal-Hintergründe

  // Number pad
  numberPadButton: string;
  numberPadButtonText: string;
  numberPadButtonSelected: string;
  numberPadButtonTextSelected: string;
}

// Spacing
interface ThemeSpacing {
  none: number;
  xxs: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
  huge: number;
  massive: number;
  giant: number;

  // Board
  boardMargin: number;
  cellPadding: number;
  gridLineWidth: number;
  gridBoldLineWidth: number;

  // Layout
  screenPadding: number;
  sectionGap: number;
  itemGap: number;

  // Buttons
  buttonHeight: number;
  buttonPadding: number;
  buttonBorderRadius: number;

  // Number pad
  numberPadButtonSize: number;
  numberPadButtonMargin: number;
  numberPadButtonBorderRadius: number;
}

// Radius interface for border radius consistency
interface ThemeRadius {
  none: number;
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  round: number;
}

// Shadow interface for elevation consistency
interface ThemeShadows {
  none: any;
  sm: any;
  md: any;
  lg: any;
  xl: any;
}

// Timing interface for animations
interface ThemeTiming {
  quick: number;
  normal: number;
  slow: number;
}

// Der vollständige Theme-Typ
export interface Theme {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  typography: any; // TypeScript-Definition für Typography kann bei Bedarf hinzugefügt werden
  radius: ThemeRadius;
  shadows: ThemeShadows;
  timing: ThemeTiming;
  isDark: boolean; // Added to easily check if we're in dark mode
}