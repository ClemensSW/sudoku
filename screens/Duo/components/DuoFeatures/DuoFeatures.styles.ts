// screens/Duo/components/DuoFeatures/DuoFeatures.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  featuresContainer: {
    width: "100%",
    marginBottom: 20,
  },
  featuresTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "center",
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  featureIcon: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    // fontSize set dynamically via theme.typography
    fontWeight: "700",
    marginBottom: 4,
  },
  featureDescription: {
    // fontSize set dynamically via theme.typography
    lineHeight: 20,
  },
});