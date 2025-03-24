// components/CustomAlert/AlertHelpers.ts
import { AlertButton, AlertType, ButtonType } from './CustomAlert';

/**
 * Helper functions to quickly create different types of alerts
 */

/**
 * Create success alert configuration
 */
export const successAlert = (
  title: string,
  message: string,
  onPress?: () => void,
  buttonText = "OK"
) => ({
  title,
  message,
  type: "success" as AlertType,
  buttons: [
    {
      text: buttonText,
      style: "success" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create error alert configuration
 */
export const errorAlert = (
  title: string,
  message: string,
  onPress?: () => void,
  buttonText = "OK"
) => ({
  title,
  message,
  type: "error" as AlertType,
  buttons: [
    {
      text: buttonText,
      style: "danger" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create warning alert configuration
 */
export const warningAlert = (
  title: string,
  message: string,
  onPress?: () => void,
  buttonText = "OK"
) => ({
  title,
  message,
  type: "warning" as AlertType,
  buttons: [
    {
      text: buttonText,
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create info alert configuration
 */
export const infoAlert = (
  title: string,
  message: string,
  onPress?: () => void,
  buttonText = "OK"
) => ({
  title,
  message,
  type: "info" as AlertType,
  buttons: [
    {
      text: buttonText,
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create confirmation alert configuration
 */
export const confirmationAlert = (
  title: string,
  message: string,
  onConfirm: () => void,
  onCancel?: () => void,
  confirmText = "Ja",
  cancelText = "Abbrechen"
) => ({
  title,
  message,
  type: "confirmation" as AlertType,
  buttons: [
    {
      text: cancelText,
      style: "cancel" as ButtonType,
      onPress: onCancel
    },
    {
      text: confirmText,
      style: "primary" as ButtonType,
      onPress: onConfirm
    }
  ] as AlertButton[]
});

/**
 * Create game completion alert configuration
 */
export const gameCompletionAlert = (
  time: string,
  autoNotesUsed: boolean,
  onNewGame: () => void
) => {
  let message = `Du hast das Sudoku in ${time} gelöst!`;
  
  if (autoNotesUsed) {
    message += "\n\nDa automatische Notizen verwendet wurden, wird dieses Spiel nicht in den Statistiken gezählt.";
  }
  
  return {
    title: "Glückwunsch!",
    message,
    type: "success" as AlertType,
    buttons: [
      {
        text: "Neues Spiel",
        style: "primary" as ButtonType,
        onPress: onNewGame
      }
    ]
  };
};

/**
 * Create game over alert configuration
 */
export const gameOverAlert = (
  autoNotesUsed: boolean,
  onNewGame: () => void
) => {
  let message = "Du hast zu viele Fehler gemacht. Versuche es erneut!";
  
  if (autoNotesUsed) {
    message += "\n\nDa automatische Notizen verwendet wurden, wird dieses Spiel nicht in den Statistiken gezählt.";
  }
  
  return {
    title: "Spiel beendet!",
    message,
    type: "error" as AlertType,
    buttons: [
      {
        text: "Neues Spiel",
        style: "primary" as ButtonType,
        onPress: onNewGame
      }
    ]
  };
};

/**
 * Create hint cell selection alert configuration
 */
export const hintCellAlert = (onPress?: () => void) => ({
  title: "Hinweis",
  message: "Diese Zelle solltest du als nächstes ausfüllen. Drücke erneut auf den Hinweis-Button, um die richtige Zahl zu sehen.",
  type: "info" as AlertType,
  buttons: [
    {
      text: "OK",
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create no errors found alert configuration
 */
export const noErrorsAlert = (onPress?: () => void) => ({
  title: "Gut gemacht!",
  message: "Dein Sudoku sieht gut aus! Fahre so fort.",
  type: "success" as AlertType,
  buttons: [
    {
      text: "OK",
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create initial cell hint alert configuration
 */
export const initialCellAlert = (onPress?: () => void) => ({
  title: "Hinweis",
  message: "Diese Zelle ist bereits korrekt ausgefüllt.",
  type: "info" as AlertType,
  buttons: [
    {
      text: "OK",
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create no hints remaining alert configuration
 */
export const noHintsAlert = (onPress?: () => void) => ({
  title: "Keine Hinweise mehr",
  message: "Du hast deine 3 Hinweise bereits aufgebraucht.",
  type: "warning" as AlertType,
  buttons: [
    {
      text: "OK",
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create auto notes alert configuration
 */
export const autoNotesAlert = (onPress?: () => void) => ({
  title: "Automatische Notizen",
  message: "Alle möglichen Notizen wurden in die leeren Zellen eingetragen.\nDieses Spiel wird nicht in den Statistiken gezählt.",
  type: "info" as AlertType,
  buttons: [
    {
      text: "OK",
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create quit game confirmation alert configuration
 */
export const quitGameAlert = (onConfirm: () => void, onCancel?: () => void) => ({
  title: "Zurück zum Hauptmenü?",
  message: "Dein aktueller Spielfortschritt geht verloren.",
  type: "confirmation" as AlertType,
  buttons: [
    {
      text: "Abbrechen",
      style: "cancel" as ButtonType,
      onPress: onCancel
    },
    {
      text: "Zum Menü",
      style: "primary" as ButtonType,
      onPress: onConfirm
    }
  ] as AlertButton[]
});