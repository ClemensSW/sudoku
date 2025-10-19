// components/CustomAlert/AlertHelpers.ts
import React from 'react';
import i18n from '@/locales/i18n';
import { AlertButton, AlertType, ButtonType } from './CustomAlert';
import InkIcon from '@/assets/svg/ink.svg';
import CloudsIcon from '@/assets/svg/clouds.svg';

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
  buttonText?: string
) => ({
  title,
  message,
  type: "success" as AlertType,
  buttons: [
    {
      text: buttonText || i18n.t('alerts:buttons.ok'),
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
  buttonText?: string
) => ({
  title,
  message,
  type: "error" as AlertType,
  buttons: [
    {
      text: buttonText || i18n.t('alerts:buttons.ok'),
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
  buttonText?: string
) => ({
  title,
  message,
  type: "warning" as AlertType,
  buttons: [
    {
      text: buttonText || i18n.t('alerts:buttons.ok'),
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
  buttonText?: string
) => ({
  title,
  message,
  type: "info" as AlertType,
  buttons: [
    {
      text: buttonText || i18n.t('alerts:buttons.ok'),
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
  confirmText?: string,
  cancelText?: string
) => ({
  title,
  message,
  type: "confirmation" as AlertType,
  buttons: [
    {
      text: cancelText || i18n.t('alerts:buttons.cancel'),
      style: "cancel" as ButtonType,
      onPress: onCancel
    },
    {
      text: confirmText || i18n.t('alerts:buttons.yes'),
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
  let message = i18n.t('alerts:game.completion.message', { time });

  if (autoNotesUsed) {
    message += i18n.t('alerts:game.completion.autoNotesNote');
  }

  return {
    title: i18n.t('alerts:game.completion.title'),
    message,
    type: "success" as AlertType,
    buttons: [
      {
        text: i18n.t('alerts:buttons.newGame'),
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
  let message = i18n.t('alerts:game.gameOver.message');

  if (autoNotesUsed) {
    message += i18n.t('alerts:game.gameOver.autoNotesNote');
  }

  return {
    title: i18n.t('alerts:game.gameOver.title'),
    message,
    type: "error" as AlertType,
    buttons: [
      {
        text: i18n.t('alerts:buttons.newGame'),
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
  title: i18n.t('alerts:game.hint.cellSelected.title'),
  message: i18n.t('alerts:game.hint.cellSelected.message'),
  type: "info" as AlertType,
  buttons: [
    {
      text: i18n.t('alerts:buttons.ok'),
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create no errors found alert configuration
 */
export const noErrorsAlert = (onPress?: () => void) => ({
  title: i18n.t('alerts:game.noErrors.title'),
  message: i18n.t('alerts:game.noErrors.message'),
  type: "success" as AlertType,
  buttons: [
    {
      text: i18n.t('alerts:buttons.ok'),
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create initial cell hint alert configuration
 */
export const initialCellAlert = (onPress?: () => void) => ({
  title: i18n.t('alerts:game.hint.initialCell.title'),
  message: i18n.t('alerts:game.hint.initialCell.message'),
  type: "info" as AlertType,
  buttons: [
    {
      text: i18n.t('alerts:buttons.ok'),
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create no hints remaining alert configuration
 */
export const noHintsAlert = (onPress?: () => void) => ({
  title: i18n.t('alerts:game.hint.noHintsRemaining.title'),
  message: i18n.t('alerts:game.hint.noHintsRemaining.message'),
  type: "warning" as AlertType,
  buttons: [
    {
      text: i18n.t('alerts:buttons.ok'),
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create auto notes alert configuration
 */
export const autoNotesAlert = (onPress?: () => void) => ({
  title: i18n.t('alerts:game.autoNotes.title'),
  message: i18n.t('alerts:game.autoNotes.message'),
  type: "info" as AlertType,
  customIcon: React.createElement(InkIcon, { width: 32, height: 32 }),
  buttons: [
    {
      text: i18n.t('alerts:buttons.ok'),
      style: "primary" as ButtonType,
      onPress
    }
  ]
});

/**
 * Create quit game confirmation alert configuration
 */
export const quitGameAlert = (onConfirm: () => void, onCancel?: () => void) => ({
  title: i18n.t('alerts:game.quit.title'),
  message: i18n.t('alerts:game.quit.message'),
  type: "warning" as AlertType,
  buttons: [
    {
      text: i18n.t('alerts:buttons.cancel'),
      style: "cancel" as ButtonType,
      onPress: onCancel || (() => {})
    },
    {
      text: i18n.t('alerts:buttons.toMenu'),
      style: "destructive" as ButtonType,
      onPress: onConfirm
    }
  ] as AlertButton[]
});

/**
 * Create quit game confirmation alert styled specifically for Duo Mode
 * Uses the current dynamic path color for the icon and confirm button
 */
export const duoQuitGameAlert = (onConfirm: () => void, onCancel?: () => void) => ({
  title: i18n.t('alerts:game.quit.title'),
  message: i18n.t('alerts:game.quit.message'),
  type: "duoMode" as AlertType, // Custom type for Duo Mode
  buttons: [
    {
      text: i18n.t('alerts:buttons.cancel'),
      style: "cancel" as ButtonType,
      onPress: onCancel || (() => {})
    },
    {
      text: i18n.t('alerts:buttons.toMenu'),
      style: "duoButton" as ButtonType, // Custom style for Duo Mode
      onPress: onConfirm
    }
  ] as AlertButton[]
});

/**
 * Create sync success alert configuration with CloudsIcon
 */
export const syncSuccessAlert = (onPress?: () => void) => ({
  title: i18n.t('settings:authSection.syncSuccess'),
  message: i18n.t('settings:authSection.syncSuccessMessage'),
  type: "success" as AlertType,
  customIcon: React.createElement(CloudsIcon, { width: 64, height: 64 }),
  buttons: [
    {
      text: i18n.t('alerts:buttons.ok'),
      style: "primary" as ButtonType,
      onPress
    }
  ]
});