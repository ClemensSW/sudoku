// components/DifficultyModal/DifficultyModal.styles.ts
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
    // Die Farbe wird jetzt dynamisch aus dem Theme übernommen
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
  difficultyContainer: {
    width: "100%",
    marginBottom: 24,
  },
  difficultyButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1.5,
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: "600",
  },
  modalButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});