// screens/GameCompletion/screens/AutoNotesScreen/AutoNotesScreen.styles.ts
import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 160, // Space for action buttons (2 buttons)
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
  infoCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 2,
  },
  warningIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'center',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoMessage: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  bulletContainer: {
    gap: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletIcon: {
    marginRight: 12,
  },
  bulletText: {
    fontSize: 15,
    flex: 1,
  },
  bottomSpacer: {
    height: 20,
  },
});
