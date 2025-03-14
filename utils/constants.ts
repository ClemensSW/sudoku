// utils/constants.ts

/**
 * Application-wide constants
 */

// Game constants
export const GAME_CONSTANTS = {
    // Board
    BOARD_SIZE: 9,
    BOX_SIZE: 3,
    VALID_VALUES: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    
    // Game mechanics
    MAX_ERRORS: 3,
    INITIAL_HINTS: 3,
    
    // Animations
    ANIMATION_DURATION: {
      FAST: 200,
      NORMAL: 300,
      SLOW: 500,
      ENTRANCE: 800,
    },
  
    // Storage keys
    STORAGE_KEYS: {
      GAME_STATE: "@sudoku/game_state",
      STATISTICS: "@sudoku/statistics",
      SETTINGS: "@sudoku/settings",
      LAST_DIFFICULTY: "@sudoku/last_difficulty"
    },
  };
  
  // Screen names for navigation
  export const SCREENS = {
    START: "index",
    GAME: "game",
    SETTINGS: "settings",
    HIGH_SCORES: "high-scores",
  };
  
  // App metadata
  export const APP_INFO = {
    NAME: "Sudoku",
    VERSION: "1.0.0",
    BUILD: "1",
  };
  
  export default {
    GAME_CONSTANTS,
    SCREENS,
    APP_INFO,
  };