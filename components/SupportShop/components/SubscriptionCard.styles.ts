import { StyleSheet } from "react-native";
import { spacing, radius } from "@/utils/theme";

export default StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    overflow: 'hidden',
    elevation: 2, // Leichter Schatten für Android
    shadowColor: "#000", // Schatten für iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  innerContainer: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  icon: {
    fontSize: 28,
  },
  contentContainer: {
    flex: 1,
    paddingRight: 8, // Verhindert Textabschneidung
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4, // Etwas mehr Abstand
  },
  description: {
    fontSize: 13, // Etwas größer für bessere Lesbarkeit
    lineHeight: 18,
    opacity: 0.8,
  },
  priceBar: {
    marginTop: 16, // Mehr Abstand zum Content
    padding: 12, // Mehr Padding für bessere Lesbarkeit
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  savings: {
    fontSize: 13,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4, // Mehr Platz für den Text
    borderRadius: 16,
  },
  subscribeButton: {
    paddingHorizontal: 14, 
    paddingVertical: 8, // Höhere Schaltfläche für bessere Bedienung
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  subscribeText: {
    fontSize: 14,
    fontWeight: '700',
    marginRight: 6, // Mehr Abstand zum Icon
    color: 'white',
  },
  bestValueBadge: {
    position: 'absolute',
    top: -10,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2, // Stärkerer Schatten
    shadowRadius: 3,
    zIndex: 10,
    elevation: 3, // Für Android
  },
  bestValueText: {
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  shine: {
    position: 'absolute',
    width: 60,
    height: 300,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    transform: [{ rotate: '25deg' }, { translateX: -100 }],
  },
});