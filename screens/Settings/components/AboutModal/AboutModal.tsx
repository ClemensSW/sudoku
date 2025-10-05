// screens/Settings/components/AboutModal/AboutModal.tsx
import React from "react";
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { BlurView } from "expo-blur";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useTranslation } from "react-i18next";
import InfoIcon from "@/assets/svg/info.svg";
import appConfig from "@/app.json";
import styles from "./AboutModal.styles";

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const AboutModal: React.FC<AboutModalProps> = ({ visible, onClose }) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const { colors } = theme;
  const version = appConfig.expo.version;

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="none">
      <View style={styles.overlay}>
        {/* Backdrop with Blur */}
        <BlurView
          intensity={theme.isDark ? 30 : 20}
          tint={theme.isDark ? "dark" : "light"}
          style={styles.backdrop}
        >
          <Pressable style={styles.backdrop} onPress={onClose} />
        </BlurView>

        {/* Modal Container */}
        <Animated.View
          entering={FadeIn.duration(300)}
          style={[styles.modalContainer, { backgroundColor: colors.surface }]}
        >
          {/* Header with Icon */}
          <Animated.View
            entering={FadeInDown.delay(100).duration(400)}
            style={styles.header}
          >
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
          </Animated.View>

          {/* Scrollable Content */}
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View entering={FadeInDown.delay(200).duration(400)}>
              {/* Greeting */}
              <Text style={[styles.greeting, { color: colors.textPrimary }]}>
                {t("about.greeting")}
              </Text>

              {/* Main Content Sections */}
              <View style={styles.section}>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {t("about.intro")}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {t("about.features")}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {t("about.support")}
                </Text>
              </View>

              {/* Closing */}
              <View style={[styles.section, styles.closingSection]}>
                <Text style={[styles.bodyText, { color: colors.textSecondary }]}>
                  {t("about.closing")}
                </Text>
                <Text
                  style={[styles.signature, { color: colors.textPrimary }]}
                >
                  {t("about.signature")}
                </Text>
              </View>
            </Animated.View>
          </ScrollView>

          {/* Close Button */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)}>
            <TouchableOpacity
              style={[
                styles.closeButton,
                { backgroundColor: theme.isDark ? "#8A78B4" : "#6E5AA0" },
              ]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeButtonText}>
                {t("about.closeButton")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default AboutModal;
