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
    width: 64,
    height: 64,
    marginTop: 8,
    marginBottom: 28,
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
