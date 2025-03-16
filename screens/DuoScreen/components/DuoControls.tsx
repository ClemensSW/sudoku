import React from "react";
import { View } from "react-native";
import NumberPad from "@/components/NumberPad/NumberPad"; // Verwende deine bestehende NumberPad-Komponente
import styles from "./DuoControls.styles";

interface DuoControlsProps {
  onPlayer1Input: (number: number) => void;
  onPlayer2Input: (number: number) => void;
  player1Complete: boolean;
  player2Complete: boolean;
}

const DuoControls: React.FC<DuoControlsProps> = ({
  onPlayer1Input,
  onPlayer2Input,
  player1Complete,
  player2Complete
}) => {
  return (
    <View style={styles.container}>
      {/* Spieler 1 Steuerelemente (rotiert) */}
      <View style={[styles.playerControls, styles.player1Controls]}>
        <View style={styles.rotatedControls}>
          <NumberPad
            onNumberPress={onPlayer1Input}
            onErasePress={() => {/* Löschlogik für P1 */}}
            onNoteToggle={() => {/* Notizen-Toggle für P1 */}}
            noteModeActive={false} // Müsste eigenen State haben
            disabledNumbers={[]} // Implementiere eigene Logik
            disabled={player1Complete}
          />
        </View>
      </View>
      
      {/* Spieler 2 Steuerelemente (normal) */}
      <View style={[styles.playerControls, styles.player2Controls]}>
        <NumberPad
          onNumberPress={onPlayer2Input}
          onErasePress={() => {/* Löschlogik für P2 */}}
          onNoteToggle={() => {/* Notizen-Toggle für P2 */}}
          noteModeActive={false} // Müsste eigenen State haben
          disabledNumbers={[]} // Implementiere eigene Logik
          disabled={player2Complete}
        />
      </View>
    </View>
  );
};