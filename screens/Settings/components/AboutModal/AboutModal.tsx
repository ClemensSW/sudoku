// screens/Settings/components/AboutModal/AboutModal.tsx
import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import Constants from "expo-constants";
import InfoIcon from "@/assets/svg/info.svg";
import styles from "./AboutModal.styles";

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const { colors } = theme;
  const version = Constants.expoConfig?.version || "1.0.0";
  const { height: screenHeight } = useWindowDimensions();

  // Berechne maxHeight für ScrollView basierend auf Bildschirmhöhe
  // Header (~200px) + Button (~70px) + Padding (~40px) = ~310px
  // ScrollView bekommt den Rest, max 400px
  const scrollViewMaxHeight = Math.min(400, screenHeight * 0.9 - 310);


  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View entering={FadeIn.duration(300)} style={styles.overlay}>
        {/* Backdrop with Blur (iOS) or solid overlay (Android) */}
        {Platform.OS === 'ios' ? (
          <BlurView
            intensity={theme.isDark ? 30 : 20}
            tint={theme.isDark ? "dark" : "light"}
            style={styles.backdrop}
          />
        ) : (
          <View
            style={[
              styles.backdrop,
              {
                backgroundColor: theme.isDark
                  ? "rgba(0, 0, 0, 0.7)"
                  : "rgba(0, 0, 0, 0.5)",
              },
            ]}
          />
        )}
        <Pressable style={styles.backdrop} onPress={onClose} />

        {/* Modal Container */}
        <Animated.View
          entering={FadeInDown.duration(400).delay(100)}
          style={[
            styles.modalContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          {/* Header with Icon */}
            <View style={styles.header}>
            <View style={styles.iconContainer}>
              <InfoIcon
                width={64}
                height={64}
                color={theme.isDark ? "#8A78B4" : "#6E5AA0"}
              />
            </View>

            <Text style={[styles.title, { color: colors.textPrimary }]}>
              {t("about.title")}
            </Text>

            {/* Version Badge */}
            <View
              style={[
                styles.versionBadge,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(138, 120, 180, 0.15)"
                    : "rgba(110, 90, 160, 0.15)",
                },
              ]}
            >
              <Text
                style={[
                  styles.versionText,
                  { color: theme.isDark ? "#8A78B4" : "#6E5AA0" },
                ]}
              >
                Version {version}
              </Text>
            </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView
            style={[styles.scrollView, { maxHeight: scrollViewMaxHeight }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View>
              {/* Greeting */}
              <Text style={[styles.greeting, { color: colors.textPrimary }]}>
                {t("about.greeting") || "Hi! Ich bin Clemens 👋"}
              </Text>

              {/* Main Content Sections */}
              <View style={styles.section}>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {t("about.intro") || "Sudoku Duo ist meine erste selbst entwickelte App."}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {t("about.features") || "Ich liebe Denksport und wollte eine Sudoku-App erschaffen, die nicht nur entspannt und fordert, sondern auch verbindet: Mit dem einzigartigen 2-Spieler-Modus wird Sudoku zum gemeinsamen Erlebnis – ideal für Freunde, Paare oder kleine Wettkämpfe."}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {t("about.support") || "Wenn dir die App gefällt, würde ich mich riesig über deine Unterstützung freuen. Deine Bewertung im Play Store hilft mir, Sudoku Duo und neue Projekte weiterzuentwickeln."}
                </Text>
              </View>

              {/* Closing */}
              <View style={[styles.section, styles.closingSection]}>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {t("about.closing") || "Danke, dass du dabei bist."}
                </Text>
                <Text
                  style={[styles.signature, { color: colors.textPrimary }]}
                >
                  {t("about.signature") || "Happy Puzzling! 🧩"}
                </Text>
              </View>
            </View>
            </ScrollView>

            {/* Close Button */}
            <View>
            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: theme.isDark ? "#8A78B4" : "#6E5AA0" },
              ]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>
                {t("about.closeButton") || "Schließen"}
              </Text>
            </TouchableOpacity>
            </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

export default AboutModal;
