// components/ReviewSystem/styles.ts

import { StyleSheet } from 'react-native';
import { spacing, colors, typography } from '@/utils/theme';

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
    fontSize: typography.size.xl,
    fontWeight: typography.weight.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitleText: {
    fontSize: typography.size.md,
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
    fontSize: typography.size.md,
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
    fontSize: typography.size.md,
    fontWeight: typography.weight.bold,
    color: 'white',
  },
  
  // Dynamic Theme Colors - Diese werden zur Laufzeit angewendet
  lightTheme: {
    background: '#FFFFFF',
    text: '#202124',
    secondaryText: '#5F6368',
    inputBackground: '#F1F3F4',
    buttonBackground: '#4285F4',
    borderColor: '#E8EAED',
  },
  darkTheme: {
    background: '#202124',
    text: '#E8EAED',
    secondaryText: '#9AA0A6',
    inputBackground: '#303134',
    buttonBackground: '#8AB4F8',
    borderColor: '#5F6368',
  },
  
  // Emoji-bezogene Farben
  emojiColors: {
    fiveStar: '#FFCC00',    // Gold für 5 Sterne
    fourStar: '#FFCC00',    // Gold für 4 Sterne
    threeStar: '#FFCC00',   // Gold für 3 Sterne
    twoStar: '#FF6B6B',     // Rot für 2 Sterne
    oneStar: '#FF6B6B',     // Rot für 1 Stern
  }
});

// Dynamische Theme-Funktionen - werden für die Komponenten exportiert
export const getThemeStyles = (isDark: boolean) => {
  return isDark ? styles.darkTheme : styles.lightTheme;
};

export const getEmojiBackgroundColor = (rating: number) => {
  switch(rating) {
    case 5: return `${styles.emojiColors.fiveStar}30`; // 30 ist Transparenz
    case 4: return `${styles.emojiColors.fourStar}30`;
    case 3: return `${styles.emojiColors.threeStar}30`;
    case 2: return `${styles.emojiColors.twoStar}30`;
    case 1: return `${styles.emojiColors.oneStar}30`;
    default: return `${styles.emojiColors.fiveStar}30`;
  }
};

export const getEmojiColor = (rating: number) => {
  switch(rating) {
    case 5: return styles.emojiColors.fiveStar;
    case 4: return styles.emojiColors.fourStar;
    case 3: return styles.emojiColors.threeStar;
    case 2: return styles.emojiColors.twoStar;
    case 1: return styles.emojiColors.oneStar;
    default: return styles.emojiColors.fiveStar;
  }
};