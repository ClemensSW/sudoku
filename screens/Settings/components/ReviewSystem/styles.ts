// screens/SettingsScreen/components/ReviewSystem/styles.ts
import { StyleSheet, Dimensions } from 'react-native';
import { spacing, colors } from '@/utils/theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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
  // Bottom Sheet Modal Styles
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end', // Changed to align at bottom
    alignItems: 'center',
  },
  modalContainer: {
    width: '100%', // Full width
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 24,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 100,
  },
  
  // Fullscreen Modal Styles
  fullscreenModal: {
    flex: 1,
    width: '100%',
    height: SCREEN_HEIGHT,
  },
  fullscreenContent: {
    flex: 1,
    padding: 24,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  
  // Content Styles
  iconWrapper: {
    marginBottom: 24,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emojiCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  iconAbsolute: {
    position: 'absolute',
    top: 8,
  },
  textContainer: {
    height: 120,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    minHeight: 32,
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
    minHeight: 48,
  },
  
  // Star Rating Styles
  starsContainer: {
    flexDirection: 'row',
    marginVertical: 32,
  },
  starButton: {
    padding: 8,
  },
  
  // Category Selection Styles
  categoriesContainer: {
    width: '100%',
    marginBottom: 24,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  categoryRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    marginRight: 16,
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
    marginRight: 16,
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
    minHeight: 180,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    textAlignVertical: 'top',
  },
  emailInput: {
    width: '100%',
    height: 52,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  
  // Button Styles - Updated to match the screenshots
  buttonContainer: {
    width: '100%',
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  
  // Animation handle for bottom sheet
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    marginBottom: 16,
    alignSelf: 'center',
  },
});

// Separate theme colors into their own object (not part of StyleSheet)
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

// Separate emoji colors into their own object
export const emojiColors: EmojiColors = {
  fiveStar: '#FFD700',    // Gold for 5 stars
  fourStar: '#FFD700',    // Gold for 4 stars
  threeStar: '#FFD700',   // Gold for 3 stars
  twoStar: '#FF6B6B',     // Red for 2 stars
  oneStar: '#FF6B6B',     // Red for 1 star
};

// Dynamic Theme Functions
export const getThemeStyles = (isDark: boolean): ThemeStyles => {
  return isDark ? themeStyles.dark : themeStyles.light;
};

export const getEmojiBackgroundColor = (rating: number): string => {
  switch(rating) {
    case 5: return `${emojiColors.fiveStar}30`;
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