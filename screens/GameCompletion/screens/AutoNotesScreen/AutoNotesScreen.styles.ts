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
    width: 100,
    height: 100,
    marginTop: 48,
    marginBottom: 80,
    alignItems: 'center',
    justifyContent: 'center',
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
    // fontSize set dynamically via theme.typography
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  infoMessage: {
    // fontSize set dynamically via theme.typography
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
    // fontSize set dynamically via theme.typography
    flex: 1,
  },
  bottomSpacer: {
    height: 20,
  },
});
