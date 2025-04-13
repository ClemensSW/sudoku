// utils/theme/colors.ts
// Modern color palette optimized for readability and aesthetics

// Light theme colors
// Light theme colors - modernized version
const lightColors = {
  // Primary colors
  primary: "#4A7D78", // Deine Teal-Primärfarbe beibehalten
  primaryLight: "#6CACA6", // Hellere Variante
  primaryDark: "#3A6963", // Dunklere Variante
  secondary: "#F05365", // Moderneres Pink/Rot für Akzente

  // UI elements - mehr Tiefe und Abgrenzung
  background: "#F8FAFC", // Leicht getöntes Weiß für Hintergrund
  surface: "#FFFFFF", // Reines Weiß für Karten und UI-Elemente
  card: "#FFFFFF",
  boardBackground: "#F0F4F5", // Leicht kühlerer Ton für Spielbrett

  // Cell colors - verbesserte Unterscheidbarkeit
  cellBackground: "#FFFFFF",
  cellBackgroundInitial: "#EBF4F2", // Klar erkennbar aber dezent
  cellBackgroundSelected: "#4A7D78", // Primärfarbe
  cellBackgroundRelated: "#E3F0EC", // Leicht sichtbar aber nicht ablenkend
  cellBackgroundError: "#FFECEE", // Subtiler Rot-Ton
  cellBackgroundSuccess: "#E3F7EA", // Frischer Grün-Ton
  cellBackgroundHint: "#FFF8E1", // Wärmeres Gelb für Hinweise
  cellBackgroundSameValue: "#6CACA6", // Beibehaltung

  // Grid
  gridLine: "#DDE5ED", // Deutlicherer Kontrast für bessere Lesbarkeit
  gridBold: "#B0C4D4", // Stärkere Abgrenzung für Blockgrenzen

  // Text
  textPrimary: "#1A2C42", // Dunkleres Blau für bessere Lesbarkeit
  textSecondary: "#4E6987", // Mittlerer Blaugrau-Ton
  textLight: "#6B89A8", // Heller Blaugrau-Ton
  textOnPrimary: "#FFFFFF",
  textCellNormal: "#2C3E50",
  textCellInitial: "#10253E", // Dunkler für besseren Kontrast
  textCellSelected: "#FFFFFF",
  textCellError: "#E53E3E",
  textCellNotes: "#5C6BC0",

  // UI elements
  button: "#4A7D78", // Primärfarbe
  buttonText: "#FFFFFF",
  buttonDisabled: "#DDE3EA", // Grauer als zuvor
  buttonTextDisabled: "#A0AEC0",
  buttonSuccess: "#2FAF73", // Kräftigeres Grün
  buttonDanger: "#E53E3E",

  // Status colors
  success: "#2FAF73", // Kräftigeres Grün
  error: "#E53E3E",
  warning: "#F6AD37", // Wärmeres Orange
  info: "#3182CE",

  // Misc
  border: "#E2E8F0",
  divider: "#EDF2F7",
  shadow: "rgba(0, 0, 0, 0.07)",
  overlay: "rgba(0, 0, 0, 0.4)",
  backdropColor: "rgba(255, 255, 255, 0.85)", // Leichtere Version für Light-Modus

  // Number pad
  numberPadButton: "#F0F7F7", // Leicht getönter Hintergrund
  numberPadButtonText: "#1A2C42",
  numberPadButtonSelected: "#4A7D78", // Primärfarbe
  numberPadButtonTextSelected: "#FFFFFF",
};

// Dark theme optimized for eye comfort
const darkColors = {
  // Primary colors
  primary: "#4A7D78", // Neue Primärfarbe
  primaryLight: "#6CACA6", // Hellere Variante
  primaryDark: "#3A6963", // Dunklere Variante
  secondary: "#F64A7A",

  // UI elements
  background: "#0F172A",
  surface: "#1E293B",
  card: "#2D3748",
  boardBackground: "#1A202C",

  // Cell colors
  cellBackground: "#2D3748",
  cellBackgroundInitial: "#2C3B52",
  cellBackgroundSelected: "#4A7D78", // Neue Primärfarbe
  cellBackgroundRelated: "#1A237E70",
  cellBackgroundError: "#B7191970",
  cellBackgroundSuccess: "#1B5E2070",
  cellBackgroundHint: "#F9A82570",
  cellBackgroundSameValue: "#6CACA670", // Helleres Teal mit Transparenz

  // Grid
  gridLine: "#4A5568",
  gridBold: "#A0AEC0",

  // Text
  textPrimary: "#F7FAFC",
  textSecondary: "#E2E8F0",
  textLight: "#CBD5E0",
  textOnPrimary: "#FFFFFF",
  textCellNormal: "#F7FAFC",
  textCellInitial: "#90CAF9",
  textCellSelected: "#FFFFFF",
  textCellError: "#FEB2B2",
  textCellNotes: "#B794F4",

  // UI elements
  button: "#4A7D78", // Neue Primärfarbe
  buttonText: "#FFFFFF",
  buttonDisabled: "#4A5568",
  buttonTextDisabled: "#A0AEC0",
  buttonSuccess: "#48BB78",
  buttonDanger: "#F56565",

  // Status colors
  success: "#48BB78",
  error: "#F56565",
  warning: "#ED8936",
  info: "#4299E1",

  // Misc
  border: "#4A5568",
  divider: "#2D3748",
  shadow: "rgba(0, 0, 0, 0.3)",
  overlay: "rgba(0, 0, 0, 0.7)",
  backdropColor: "rgba(0, 0, 0, 0.85)", // Dunklere Version für Dark-Modus

  // Number pad
  numberPadButton: "#2D3748",
  numberPadButtonText: "#F7FAFC",
  numberPadButtonSelected: "#4A7D78", // Neue Primärfarbe
  numberPadButtonTextSelected: "#FFFFFF",
};

// Export theme based on system preference or user selection
export const colors = {
  light: lightColors,
  dark: darkColors,
};

export default colors;
