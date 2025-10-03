// components/GameModeModal/GameModeModal.styles.ts
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    // Entferne diese feste Farbe:
    // backgroundColor: "rgba(0, 0, 0, 0.85)",
  },
  modalContent: {
    width: "85%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    opacity: 0.7,
  },
  modeContainer: {
    width: "100%",
    marginBottom: 10,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1.5,
  },
  disabledModeButton: {
    opacity: 0.8,
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  modeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(67, 97, 238, 0.1)",
    marginRight: 16,
  },
  disabledIconContainer: {
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  modeTextContainer: {
    flex: 1,
  },
  onlineTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 4,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  modeDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  comingSoonBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 6,
  },
  comingSoonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
  },
});