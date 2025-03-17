// utils/theme/colors.ts
// Modern color palette optimized for readability and aesthetics

// Light theme colors
const lightColors = {
  // Primary colors
  primary: "#4A7D78", // Neuer Teal-Ton als Primärfarbe
  primaryLight: "#6CACA6", // Hellere Variante für gleiche Werte
  primaryDark: "#3A6963", // Dunklere Variante für Interaktionen
  secondary: "#F64A7A", // Vibrant accent for highlights

  // UI elements
  background: "#FFFFFF",
  surface: "#F8F9FA",
  card: "#FFFFFF",
  boardBackground: "#F9F9FB", // Light neutral background for board

  // Cell colors
  cellBackground: "#FFFFFF", 
  cellBackgroundInitial: "#F0F4F2", // Leicht angepasst für Teal-Ton
  cellBackgroundSelected: "#4A7D78", // Neue Primärfarbe
  cellBackgroundRelated: "#E3F2ED", // Teal-tinted bg für verwandte Zellen
  cellBackgroundError: "#FFEBEE", 
  cellBackgroundSuccess: "#E8F5E9", 
  cellBackgroundHint: "#FFF9C4", 
  cellBackgroundSameValue: "#6CACA6", // Helleres Teal für gleiche Werte

  // Grid
  gridLine: "#D0D7DF", 
  gridBold: "#90A4AE", 

  // Text
  textPrimary: "#1A1F36",
  textSecondary: "#4A5568",
  textLight: "#718096",
  textOnPrimary: "#FFFFFF",
  textCellNormal: "#2C3E50", 
  textCellInitial: "#1A1F36", 
  textCellSelected: "#FFFFFF", 
  textCellError: "#E53E3E", 
  textCellNotes: "#5C6BC0", 

  // UI elements
  button: "#4A7D78", // Neue Primärfarbe
  buttonText: "#FFFFFF",
  buttonDisabled: "#CBD5E0",
  buttonTextDisabled: "#A0AEC0",
  buttonSuccess: "#38A169",
  buttonDanger: "#E53E3E",

  // Status colors
  success: "#38A169",
  error: "#E53E3E",
  warning: "#DD6B20",
  info: "#3182CE",

  // Misc
  border: "#E2E8F0",
  divider: "#EDF2F7",
  shadow: "rgba(0, 0, 0, 0.1)",
  overlay: "rgba(0, 0, 0, 0.5)",

  // Number pad
  numberPadButton: "#F0F3F9",
  numberPadButtonText: "#1A1F36",
  numberPadButtonSelected: "#4A7D78", // Neue Primärfarbe
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