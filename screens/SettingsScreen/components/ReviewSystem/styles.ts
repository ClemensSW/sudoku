// styles.ts
import { StyleSheet } from 'react-native';
import { spacing, colors } from '@/utils/theme';

// Define the theme interfaces to properly type our theme styles
interface ThemeStyles {
  background: string;
  text: string;
  secondaryText: string;
  inputBackground: string;
  buttonBackground: string;
  borderColor: string;
}

// Define emoji colors interface
interface EmojiColors {
  fiveStar: string;
  fourStar: string;
  threeStar: string;
  twoStar: string;
  oneStar: string;
}

export const styles = StyleSheet.create({
  // Modal Container Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    maxWidth: 350,
    borderRadius: 16,
    padding: spacing.md,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 100,
  },
  
  // Content Styles
  emojiContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  titleText: {
    fontSize: 20,
    fontWeight: '700', // Fixed: Use string values supported by React Native
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.sm,
  },
  
  // Star Rating Styles
  starsContainer: {
    flexDirection: 'row',
    marginVertical: spacing.md,
  },
  starButton: {
    padding: spacing.xs,
  },
  star: {
    width: 40,
    height: 40,
  },
  
  // Category Selection Styles
  categoriesContainer: {
    width: '100%',
    marginBottom: spacing.md,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.xs,
  },
  categoryRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryRadioSelected: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  categoryIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryLabel: {
    flex: 1,
    fontSize: 16,
  },
  
  // Feedback Form Styles
  feedbackInput: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
    textAlignVertical: 'top',
  },
  emailInput: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  
  // Button Styles
  buttonContainer: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700', // Fixed: Use string values supported by React Native
    color: 'white',
  },
});

// Separate theme colors into their own object (not part of StyleSheet)
// This prevents type issues with backgroundColor, color, etc.
export const themeStyles: Record<'light' | 'dark', ThemeStyles> = {
  light: {
    background: '#FFFFFF',
    text: '#202124',
    secondaryText: '#5F6368',
    inputBackground: '#F1F3F4',
    buttonBackground: '#4285F4',
    borderColor: '#E8EAED',
  },
  dark: {
    background: '#202124',
    text: '#E8EAED',
    secondaryText: '#9AA0A6',
    inputBackground: '#303134',
    buttonBackground: '#8AB4F8',
    borderColor: '#5F6368',
  }
};

// Separate emoji colors into their own object (not part of StyleSheet)
export const emojiColors: EmojiColors = {
  fiveStar: '#FFCC00',    // Gold for 5 stars
  fourStar: '#FFCC00',    // Gold for 4 stars
  threeStar: '#FFCC00',   // Gold for 3 stars
  twoStar: '#FF6B6B',     // Red for 2 stars
  oneStar: '#FF6B6B',     // Red for 1 star
};

// Dynamic Theme Functions - exported for components
export const getThemeStyles = (isDark: boolean): ThemeStyles => {
  return isDark ? themeStyles.dark : themeStyles.light;
};

export const getEmojiBackgroundColor = (rating: number): string => {
  switch(rating) {
    case 5: return `${emojiColors.fiveStar}30`; // 30 is transparency
    case 4: return `${emojiColors.fourStar}30`;
    case 3: return `${emojiColors.threeStar}30`;
    case 2: return `${emojiColors.twoStar}30`;
    case 1: return `${emojiColors.oneStar}30`;
    default: return `${emojiColors.fiveStar}30`;
  }
};

export const getEmojiColor = (rating: number): string => {
  switch(rating) {
    case 5: return emojiColors.fiveStar;
    case 4: return emojiColors.fourStar;
    case 3: return emojiColors.threeStar;
    case 2: return emojiColors.twoStar;
    case 1: return emojiColors.oneStar;
    default: return emojiColors.fiveStar;
  }
};