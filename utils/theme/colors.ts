// Optimized color palettes for the best Sudoku experience
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
  boardBackground: "#F9F9F9", // Light neutral background for board

  // Cell colors - Optimal contrast and clear visual hierarchy
  cellBackground: "#FFFFFF", // Pure white for empty cells
  cellBackgroundInitial: "#F0F4FF", // Light blue tint for initial cells
  cellBackgroundSelected: "#BBDEFB", // Medium blue for selected cell
  cellBackgroundRelated: "#E3F2FD", // Light blue for related cells
  cellBackgroundError: "#FFEBEE", // Light red for errors
  cellBackgroundSuccess: "#E8F5E9", // Light green for success
  cellBackgroundHint: "#FFF9C4", // Light yellow for hints
  cellBackgroundSameValue: "#E1F5FE", // Light cyan for same values

  // Grid - Clear visual structure
  gridLine: "#CFD8DC", // Light gray for cell borders
  gridBold: "#90A4AE", // Darker gray for 3x3 box borders

  // Text - High contrast for readability
  textPrimary: "#212121",
  textSecondary: "#424242",
  textLight: "#757575",
  textOnPrimary: "#FFFFFF",
  textCellNormal: "#2C3E50", // Dark blue-gray for regular numbers
  textCellInitial: "#000000", // Black for initial values for emphasis
  textCellSelected: "#2C3E50", // Same as normal for consistency
  textCellError: "#D32F2F", // Bold red for errors
  textCellNotes: "#5C6BC0", // Indigo for notes - stands out but not too much

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

// Dark theme optimized for Sudoku gameplay
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
  boardBackground: "#1A1A1A", // Dark neutral background for board

  // Cell colors - Good contrast with dark theme
  cellBackground: "#2C2C2C", // Dark gray for empty cells
  cellBackgroundInitial: "#263238", // Darker blue-gray for initial cells
  cellBackgroundSelected: "#3949AB", // Medium-dark indigo for selected
  cellBackgroundRelated: "#1A237E70", // Semi-transparent dark blue
  cellBackgroundError: "#B7191970", // Semi-transparent dark red
  cellBackgroundSuccess: "#1B5E2070", // Semi-transparent dark green
  cellBackgroundHint: "#F9A82570", // Semi-transparent amber for hints
  cellBackgroundSameValue: "#0D47A170", // Semi-transparent dark blue

  // Grid - Clear structure even in dark mode
  gridLine: "#424242", // Medium gray for cell borders
  gridBold: "#9E9E9E", // Light gray for 3x3 box borders

  // Text - High contrast for readability in dark mode
  textPrimary: "#FFFFFF",
  textSecondary: "#E0E0E0",
  textLight: "#BDBDBD",
  textOnPrimary: "#FFFFFF",
  textCellNormal: "#FFFFFF", // White for regular numbers
  textCellInitial: "#90CAF9", // Light blue for initial values - stands out
  textCellSelected: "#FFFFFF", // White for selected cell text
  textCellError: "#EF9A9A", // Light red for errors - more visible on dark
  textCellNotes: "#B39DDB", // Light purple for notes

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