// components/GameModeModal/GameModeModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Animated, { ZoomIn, FadeIn } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "./GameModeModal.styles";

export type GameMode = "local" | "online";

// DUO-FARBE definieren (gleiche wie im DifficultyModal)
const DUO_COLOR = "#4A7D78"; // Konsistentes Teal aus DifficultyModal

interface GameModeModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectMode: (mode: GameMode) => void;
  noBackdrop?: boolean; // Option to hide the backdrop
}

const GameModeModal: React.FC<GameModeModalProps> = ({
  visible,
  onClose,
  onSelectMode,
  noBackdrop = false,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Duo-Farbe konsistent mit DifficultyModal
  const duoIconColor = DUO_COLOR; // Verwende immer die gleiche Farbe

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      {/* Dark semi-transparent backdrop - only if not using shared backdrop */}
      {!noBackdrop && (
        <Animated.View 
          style={[
            StyleSheet.absoluteFill, 
            styles.backdrop,
            { backgroundColor: colors.backdropColor } // Verwende die Theme-Farbe statt fester Farbe
          ]}
          entering={FadeIn.duration(300)}
        />
      )}
      
      {/* Touchable area to close modal when tapping outside */}
      <TouchableOpacity
        style={StyleSheet.absoluteFill}
        activeOpacity={1}
        onPress={onClose}
      />

      <Animated.View
        style={[styles.modalContent, { backgroundColor: colors.card }]}
        entering={ZoomIn.duration(300)}
        // Stop event propagation to prevent closing when clicking on the content
        onTouchEnd={(e) => e.stopPropagation()}
      >
        <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
          Spielmodus wählen
        </Text>

        <Text style={[styles.modalSubtitle, { color: colors.textSecondary }]}>
          Wie möchtet ihr gemeinsam spielen?
        </Text>

        <View style={styles.modeContainer}>
          {/* Local Mode Button */}
          <TouchableOpacity
            style={[
              styles.modeButton,
              { borderColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }
            ]}
            onPress={() => onSelectMode("local")}
          >
            <View style={[
              styles.modeIconContainer,
              { backgroundColor: `${duoIconColor}15` } // 15 für 15% Opacity
            ]}>
              <Feather 
                name="users" 
                size={28} 
                color={duoIconColor} // HIER: Grüne Duo-Farbe statt colors.primary
              />
            </View>
            <View style={styles.modeTextContainer}>
              <Text style={[styles.modeTitle, { color: colors.textPrimary }]}>
                Lokal spielen
              </Text>
              <Text style={[styles.modeDescription, { color: colors.textSecondary }]}>
                Teilt euch ein Gerät
              </Text>
            </View>
            <Feather 
              name="chevron-right" 
              size={24} 
              color={colors.textSecondary} 
            />
          </TouchableOpacity>

          {/* Online Mode Button - Disabled/Coming Soon */}
          <TouchableOpacity
            style={[
              styles.modeButton,
              styles.disabledModeButton,
              { borderColor: theme.isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }
            ]}
            activeOpacity={0.7}
            onPress={() => onSelectMode("online")} // Trotzdem klickbar für die Meldung
          >
            <View style={[styles.modeIconContainer, styles.disabledIconContainer]}>
              <Feather 
                name="wifi" 
                size={28} 
                color={colors.textSecondary} 
              />
            </View>
            <View style={styles.modeTextContainer}>
              <View style={styles.onlineTitleContainer}>
                <Text style={[styles.modeTitle, { color: colors.textSecondary }]}>
                  Online spielen
                </Text>
                <Animated.View 
                  style={[styles.comingSoonBadge, { backgroundColor: colors.warning }]}
                  entering={FadeIn.delay(400).duration(300)}
                >
                  <Text style={styles.comingSoonText}>In Planung</Text>
                </Animated.View>
              </View>
              <Text style={[styles.modeDescription, { color: colors.textSecondary }]}>
                Flexibel auf zwei Geräten
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

export default GameModeModal;