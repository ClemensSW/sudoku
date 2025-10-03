/**
 * Animation configuration constants for GameCompletion screen
 */
import { Easing } from 'react-native-reanimated';

/**
 * Standard animation configurations used across GameCompletion components
 * These ensure consistent animation timing and easing throughout the screen
 */
export const ANIMATION_CONFIGS = {
  /** Card entry animation - smooth scale-in effect */
  cardEntry: {
    duration: 400,
    easing: Easing.bezier(0.16, 1, 0.3, 1), // Custom smooth easing
  },

  /** Progress bar fill animation - bouncy effect */
  progressBar: {
    duration: 1200,
    easing: Easing.bezier(0.34, 1.56, 0.64, 1), // Bouncy easing
  },

  /** Level up overlay animation - quick fade */
  levelUp: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1), // Standard ease
  },

  /** Badge pulse animation - attention-grabbing */
  badgePulse: {
    duration: 500,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },

  /** Smooth fade-in for content */
  fadeIn: {
    duration: 500,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },

  /** Quick fade-out */
  fadeOut: {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
  },

  /** Milestone notification animation */
  milestone: {
    duration: 350,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  },

  /** Path trail animation - smooth progression */
  pathTrail: {
    duration: 1000,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  },
} as const;

/**
 * Animation delays for staggered animations
 */
export const ANIMATION_DELAYS = {
  /** Delay before content animations start */
  contentStart: 200,

  /** Delay before progress bar animates */
  progressBar: 800,

  /** Delay before level up overlay appears */
  levelUpOverlay: 800,

  /** Delay before milestone notification appears */
  milestone: 500,

  /** Stagger delay for multiple items */
  stagger: 150,
} as const;

/**
 * Animation durations for timed effects
 */
export const ANIMATION_DURATIONS = {
  /** How long the level up overlay stays visible */
  levelUpDisplay: 4000,

  /** How long the milestone notification stays visible */
  milestoneDisplay: 5000,

  /** How long unlock animations play */
  unlockAnimation: 600,
} as const;
