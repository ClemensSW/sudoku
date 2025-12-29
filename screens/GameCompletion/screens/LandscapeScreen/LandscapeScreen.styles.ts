// screens/GameCompletion/screens/LandscapeScreen/LandscapeScreen.styles.ts
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
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    // fontSize set dynamically via theme.typography
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 20,
  },
  bottomSpacerLarge: {
    height: 40,
  },
});
