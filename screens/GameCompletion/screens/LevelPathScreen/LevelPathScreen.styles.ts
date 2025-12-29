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
    paddingBottom: 160, // Space for continue button (increased for better scroll)
  },
  heroHeader: {
    width: '100%',
    marginBottom: 24,
  },
  heroGradient: {
    paddingTop: 48,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  heroIconWrapper: {
    position: 'relative',
    width: 64,
    height: 64,
    marginTop: 48,
    marginBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    top: -18,
    left: -18,
  },
  iconGlowOuter: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    top: -38,
    left: -38,
  },
  heroTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  heroSubtitle: {
    // fontSize set dynamically via theme.typography
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
