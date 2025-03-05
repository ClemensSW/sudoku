import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

interface DifficultySelectorProps {
  currentDifficulty: "easy" | "medium" | "hard";
  onSelectDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  currentDifficulty,
  onSelectDifficulty,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.button,
          currentDifficulty === "easy" && styles.selectedButton,
        ]}
        onPress={() => onSelectDifficulty("easy")}
      >
        <Text
          style={[
            styles.buttonText,
            currentDifficulty === "easy" && styles.selectedButtonText,
          ]}
        >
          Leicht
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          currentDifficulty === "medium" && styles.selectedButton,
        ]}
        onPress={() => onSelectDifficulty("medium")}
      >
        <Text
          style={[
            styles.buttonText,
            currentDifficulty === "medium" && styles.selectedButtonText,
          ]}
        >
          Mittel
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.button,
          currentDifficulty === "hard" && styles.selectedButton,
        ]}
        onPress={() => onSelectDifficulty("hard")}
      >
        <Text
          style={[
            styles.buttonText,
            currentDifficulty === "hard" && styles.selectedButtonText,
          ]}
        >
          Schwer
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    width: 320,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedButton: {
    backgroundColor: "#4285F4",
    borderColor: "#4285F4",
  },
  buttonText: {
    fontWeight: "bold",
  },
  selectedButtonText: {
    color: "white",
  },
});

export default DifficultySelector;
