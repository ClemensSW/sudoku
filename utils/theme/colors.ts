// Modern color palettes with better contrast ratios for both modes
const lightColors = {
  // Primary colors
  primary: "#4361EE", // Vibrant blue that stands out
  primaryLight: "#738BFF",
  primaryDark: "#3046C0",
  secondary: "#F72585", // Vibrant accent for highlights

  // UI elements
  background: "#FFFFFF",
  surface: "#F5F7FA",
  card: "#FFFFFF",
  boardBackground: "#F8F9FB",

  // Cell colors
  cellBackground: "#FFFFFF",
  cellBackgroundInitial: "#F0F3F9",
  cellBackgroundSelected: "#4361EE",
  cellBackgroundRelated: "#E8F0FE",
  cellBackgroundError: "#FFEBEE",
  cellBackgroundSuccess: "#E8F5E9",
  cellBackgroundHint: "#FFF8E1",
  cellBackgroundSameValue: "#E8F0FE",

  // Grid
  gridLine: "#CFD8DC",
  gridBold: "#263238",

  // Text
  textPrimary: "#212121",
  textSecondary: "#424242",
  textLight: "#757575",
  textOnPrimary: "#FFFFFF",
  textCellNormal: "#212121",
  textCellInitial: "#000000",
  textCellSelected: "#FFFFFF",
  textCellError: "#D32F2F",
  textCellNotes: "#616161",

  // UI elements
  button: "#4361EE",
  buttonText: "#FFFFFF",
  buttonDisabled: "#BDBDBD",
  buttonTextDisabled: "#757575",
  buttonSuccess: "#4CAF50",
  buttonDanger: "#F44336",

  // Status colors
  success: "#4CAF50",
  error: "#F44336",
  warning: "#FF9800",
  info: "#2196F3",

  // Misc
  border: "#E0E0E0",
  divider: "#EEEEEE",
  shadow: "rgba(0, 0, 0, 0.1)",
  overlay: "rgba(0, 0, 0, 0.5)",

  // Number pad
  numberPadButton: "#F0F3F9",
  numberPadButtonText: "#212121",
  numberPadButtonSelected: "#4361EE",
  numberPadButtonTextSelected: "#FFFFFF",
};

// Dark theme with improved contrast for better readability
const darkColors = {
  // Primary colors
  primary: "#4361EE", // Keeping the same primary for brand consistency
  primaryLight: "#738BFF",
  primaryDark: "#3046C0",
  secondary: "#F72585", // Same vibrant accent

  // UI elements
  background: "#121212",
  surface: "#1E1E1E",
  card: "#2C2C2C",
  boardBackground: "#1E1E1E",

  // Cell colors
  cellBackground: "#2C2C2C",
  cellBackgroundInitial: "#3A3A3A",
  cellBackgroundSelected: "#4361EE",
  cellBackgroundRelated: "#2D3748",
  cellBackgroundError: "#4A2C2C",
  cellBackgroundSuccess: "#2C3E2E",
  cellBackgroundHint: "#4A412C",
  cellBackgroundSameValue: "#2D3748",

  // Grid
  gridLine: "#444444",
  gridBold: "#CCCCCC",

  // Text - improved contrast for dark mode
  textPrimary: "#FFFFFF",
  textSecondary: "#E0E0E0",
  textLight: "#BDBDBD",
  textOnPrimary: "#FFFFFF",
  textCellNormal: "#FFFFFF",
  textCellInitial: "#FFFFFF",
  textCellSelected: "#FFFFFF",
  textCellError: "#FF8A80",
  textCellNotes: "#BDBDBD",

  // UI elements
  button: "#4361EE",
  buttonText: "#FFFFFF",
  buttonDisabled: "#5C5C5C",
  buttonTextDisabled: "#8F8F8F",
  buttonSuccess: "#4CAF50",
  buttonDanger: "#F44336",

  // Status colors
  success: "#66BB6A",
  error: "#EF5350",
  warning: "#FFA726",
  info: "#42A5F5",

  // Misc
  border: "#444444",
  divider: "#333333",
  shadow: "rgba(0, 0, 0, 0.3)",
  overlay: "rgba(0, 0, 0, 0.7)",

  // Number pad
  numberPadButton: "#3A3A3A",
  numberPadButtonText: "#FFFFFF",
  numberPadButtonSelected: "#4361EE",
  numberPadButtonTextSelected: "#FFFFFF",
};

// Export theme based on system preference or user selection
export const colors = {
  light: lightColors,
  dark: darkColors,
};

export default colors;
