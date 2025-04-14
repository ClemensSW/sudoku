// utils/theme/colors.ts
// Modern color palette optimized for readability and aesthetics

// Light theme colors
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
  cellBackgroundRelated: "#F0F7F7", // Leicht sichtbar aber nicht ablenkend
  cellBackgroundError: "#FFECEE", // Subtiler Rot-Ton
  cellBackgroundSuccess: "#E3F7EA", // Frischer Grün-Ton
  cellBackgroundHint: "#FFF8E1", // Wärmeres Gelb für Hinweise
  cellBackgroundSameValue: "#6CACA6", // Beibehaltung

  // Board (neu hinzugefügt für Sudoku-Komponenten)
  boardBackgroundColor: "#FFFFFF", // Helles Board für Light-Modus
  boardGridLineColor: "rgba(0, 0, 0, 0.2)", // Dunkle Gridlinien
  boardBorderColor: "rgba(0, 0, 0, 0.25)", // Dunklerer Außenrand
  boardCellBorderColor: "rgba(0, 0, 0, 0.15)", // Subtile Zellränder

  // Für Sudoku Cell (neu hinzugefügt)
  cellSelectedBackground: "#4A7D78", // Primärfarbe für ausgewählte Zellen
  cellRelatedBackground: "#F0F7F7", // Leicht sichtbar
  cellErrorBackground: "rgba(229, 62, 62, 0.2)", // Rot mit Transparenz
  cellHintBackground: "rgba(0, 0, 0, 0.1)",
  cellSuccessBackground: "rgba(47, 175, 115, 0.2)", // Grün mit Transparenz
  cellTextColor: "#1A2C42", // Dunkler Text für Light-Modus
  cellInitialTextColor: "#10253E", // Dunklerer Text für Initial-Zellen
  cellSelectedTextColor: "#FFFFFF", // Weißer Text auf ausgewähltem Hintergrund
  cellErrorTextColor: "#E53E3E", // Rote Fehler-Textfarbe
  cellSameValueTextColor: "#6CACA6", // Gleiche Farbe wie vorher
  cellNotesTextColor: "rgba(26, 44, 66, 0.7)", // Dunklerer Text mit Transparenz

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

// Dark theme optimized for eye comfort - mit den aktuellen Sudoku-Farben
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

  // Board (neu hinzugefügt für Sudoku-Komponenten)
  boardBackgroundColor: "#1E2233", // Die beliebte dunkelgraue Hintergrundfarbe
  boardGridLineColor: "rgba(255, 255, 255, 0.2)", // Subtile weiße Gridlinien
  boardBorderColor: "rgba(255, 255, 255, 0.25)", // Subtiler weißer Außenrand
  boardCellBorderColor: "rgba(255, 255, 255, 0.15)", // Noch subtilere weiße Zellränder

  // Für Sudoku Cell (neu hinzugefügt)
  cellSelectedBackground: "#4A7D78", // Die beliebte teal-Farbe
  cellRelatedBackground: "rgba(255, 255, 255, 0.08)", // Sehr subtiler weißer Hintergrund
  cellErrorBackground: "rgba(255, 70, 70, 0.3)", // Rot mit Transparenz
  cellHintBackground: "rgba(255, 255, 255, 0.15)", // Weißer Hintergrund mit etwas mehr Deckkraft
  cellSuccessBackground: "rgba(120, 220, 120, 0.2)", // Grün mit Transparenz
  cellTextColor: "#FFFFFF", // Weiß
  cellInitialTextColor: "#FFFFFF", // Fetteres Weiß für Anfangszahlen
  cellSelectedTextColor: "#FFFFFF", // Weißer Text auf ausgewähltem Hintergrund
  cellErrorTextColor: "#FF9A9A", // Rote Fehler-Textfarbe
  cellSameValueTextColor: "#6CACA6", // Helles Teal für gleiche Werte
  cellNotesTextColor: "rgba(255, 255, 255, 0.7)", // Weißer Text mit Transparenz

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