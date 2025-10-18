// screens/GameCompletion/screens/LevelPathScreen/LevelPathScreen.styles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120, // Space for continue button
  },
  heroHeader: {
    width: '100%',
    marginBottom: 24,
  },
  heroGradient: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroIconWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  iconGlow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 100,
    height: 100,
    borderRadius: 50,
    transform: [{ translateX: -50 }, { translateY: -50 }],
  },
  iconGlowOuter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 140,
    height: 140,
    borderRadius: 70,
    transform: [{ translateX: -70 }, { translateY: -70 }],
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 20,
  },
  sectionSpacer: {
    height: 16,
  },
  bottomSpacer: {
    height: 20,
  },
});
