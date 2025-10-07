// components/BaseModal/BaseModal.tsx
import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { BlurView } from "expo-blur";
import { triggerHaptic } from "@/utils/haptics";

interface BaseModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  isDark: boolean;
  textPrimaryColor: string;
  surfaceColor: string;
  borderColor: string;
  /** Wenn true, wird der Content in einen ScrollView gewrapped (für lange Inhalte) */
  scrollable?: boolean;
  /** Maximale Höhe des scrollbaren Bereichs als Anteil der Bildschirmhöhe (0-1). Default: 0.7 */
  maxHeightRatio?: number;
}

/**
 * Einheitliche Modal-Komponente für die gesamte App
 * Basiert auf dem Design des Language-Selector Modals aus den Einstellungen
 *
 * Features:
 * - Blur Backdrop
 * - Standardisierter Header mit Titel und X-Button
 * - Optional scrollbarer Content für lange Listen
 * - Automatische Höhenbegrenzung basierend auf Bildschirmgröße
 */
const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  onClose,
  title,
  children,
  isDark,
  textPrimaryColor,
  surfaceColor,
  borderColor,
  scrollable = false,
  maxHeightRatio = 0.7,
}) => {
  const { height } = useWindowDimensions();

  const handleClose = () => {
    triggerHaptic("light");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Backdrop mit Blur */}
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={handleClose}
      >
        <BlurView
          intensity={80}
          style={StyleSheet.absoluteFill}
          tint={isDark ? "dark" : "light"}
        />
      </TouchableOpacity>

      {/* Modal Container */}
      <View style={styles.modalContainer} pointerEvents="box-none">
        <Animated.View
          entering={FadeInDown.duration(300).springify()}
          style={[
            styles.modalContent,
            {
              backgroundColor: surfaceColor,
              borderColor: borderColor,
              maxHeight: height * 0.85, // Modal darf nie höher als 85% des Bildschirms sein
            },
          ]}
        >
          {/* Header: Titel + Close Button */}
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: textPrimaryColor }]}>
              {title}
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              style={[
                styles.closeButton,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.08)"
                    : "rgba(0,0,0,0.04)",
                },
              ]}
            >
              <Feather name="x" size={20} color={textPrimaryColor} />
            </TouchableOpacity>
          </View>

          {/* Custom Content - Optional Scrollable */}
          {scrollable ? (
            <ScrollView
              style={[styles.scrollView, { maxHeight: height * maxHeightRatio }]}
              showsVerticalScrollIndicator={true}
              bounces={false}
            >
              {children}
            </ScrollView>
          ) : (
            children
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
});

export default BaseModal;
