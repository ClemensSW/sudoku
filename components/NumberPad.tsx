import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface NumberPadProps {
  onNumberPress: (number: number) => void;
  onErasePress: () => void;
}

const NumberPad: React.FC<NumberPadProps> = ({
  onNumberPress,
  onErasePress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((num) => (
          <TouchableOpacity
            key={`num-${num}`}
            style={styles.button}
            onPress={() => onNumberPress(num)}
          >
            <Text style={styles.buttonText}>{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {[6, 7, 8, 9].map((num) => (
          <TouchableOpacity
            key={`num-${num}`}
            style={styles.button}
            onPress={() => onNumberPress(num)}
          >
            <Text style={styles.buttonText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.button, styles.eraseButton]}
          onPress={onErasePress}
        >
          <Ionicons name="backspace-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    width: 320,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
  },
  eraseButton: {
    backgroundColor: "#FF5252",
  },
  buttonText: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default NumberPad;
