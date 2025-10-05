// components/AvatarPicker/AvatarPicker.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
import { saveAvatar, deleteAvatar, getAvatarUri } from "../../utils/avatarStorage";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import {
  isDefaultAvatarPath,
  getAvatarIdFromPath,
  getAvatarById,
  getAvatarSourceFromUri,
  DEFAULT_AVATAR,
} from "../../utils/defaultAvatars";
import DefaultAvatars from "./DefaultAvatars";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import styles from "./styles";

interface AvatarPickerProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string | null) => void;
  currentAvatarUri: string | null;
}

type TabType = "default" | "gallery" | "camera";

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  visible,
  onClose,
  onImageSelected,
  currentAvatarUri,
}) => {
  const { t } = useTranslation('leistung');
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("default");

  // Tab measurements
  const tabMeasurements = useRef<{
    [key in TabType]?: { x: number; width: number };
  }>({});
  const tabIndicatorWidth = useSharedValue(0);
  const tabIndicatorPosition = useSharedValue(0);

  // Current avatar preview adjustment for default avatars
  const [previewUri, setPreviewUri] = useState<any>(null);

  useEffect(() => {
    if (currentAvatarUri) {
      // Die neue Hilfsfunktion verwenden
      setPreviewUri(getAvatarSourceFromUri(currentAvatarUri, DEFAULT_AVATAR));
    } else {
      setPreviewUri(null);
    }
  }, [currentAvatarUri]);

  // Update indicator when active tab changes
  useEffect(() => {
    const currentTabMeasurements = tabMeasurements.current[activeTab];

    if (currentTabMeasurements) {
      tabIndicatorPosition.value = withTiming(currentTabMeasurements.x, {
        duration: 300,
      });
      tabIndicatorWidth.value = withTiming(currentTabMeasurements.width, {
        duration: 300,
      });
    }
  }, [activeTab]);

  // Measure tab layout
  const measureTab = (tab: TabType, event: any) => {
    const { x, width } = event.nativeEvent.layout;
    tabMeasurements.current[tab] = { x, width };

    // If this is the active tab and it's being measured for the first time,
    // update the indicator position and width immediately
    if (tab === activeTab && tabIndicatorWidth.value === 0) {
      tabIndicatorPosition.value = x;
      tabIndicatorWidth.value = width;
    }
  };

  // Animation style for tab indicator
  const tabIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabIndicatorPosition.value }],
      width: tabIndicatorWidth.value,
    };
  });

  // Fotogalerie-Zugriff anfordern und ein Bild auswählen
  const pickImage = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          t('avatarPicker.alerts.galleryPermission.title'),
          t('avatarPicker.alerts.galleryPermission.message'),
          [{ text: "OK" }]
        );
        return;
      }

      setIsLoading(true);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const processedUri = await processImage(result.assets[0].uri);
        onImageSelected(processedUri);
        onClose();
      }
    } catch (error) {
      console.error("Fehler beim Auswählen des Bildes:", error);
      Alert.alert(
        t('avatarPicker.alerts.imageSelectError.title'),
        t('avatarPicker.alerts.imageSelectError.message')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Kamera öffnen und ein Foto aufnehmen
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          t('avatarPicker.alerts.cameraPermission.title'),
          t('avatarPicker.alerts.cameraPermission.message'),
          [{ text: "OK" }]
        );
        return;
      }

      setIsLoading(true);

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const processedUri = await processImage(result.assets[0].uri);
        onImageSelected(processedUri);
        onClose();
      }
    } catch (error) {
      console.error("Fehler beim Aufnehmen des Fotos:", error);
      Alert.alert(
        t('avatarPicker.alerts.photoError.title'),
        t('avatarPicker.alerts.photoError.message')
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Bild verarbeiten: Zuschneiden und komprimieren
  const processImage = async (uri: string): Promise<string> => {
    try {
      // Bild auf maximale Größe von 500x500 Pixeln beschränken und als JPEG mit 80% Qualität speichern
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 500, height: 500 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      // Bild im App-Verzeichnis speichern
      const savedUri = await saveAvatar(manipulatedImage.uri);
      return savedUri;
    } catch (error) {
      console.error("Fehler bei der Bildverarbeitung:", error);
      throw error;
    }
  };

  // Aktuelles Profilbild entfernen
  const removeCurrentAvatar = async () => {
    try {
      setIsLoading(true);

      // Bestätigungsdialog anzeigen
      Alert.alert(
        t('avatarPicker.alerts.removeAvatar.title'),
        t('avatarPicker.alerts.removeAvatar.message'),
        [
          { text: t('avatarPicker.alerts.removeAvatar.cancel'), style: "cancel" },
          {
            text: t('avatarPicker.alerts.removeAvatar.remove'),
            style: "destructive",
            onPress: async () => {
              try {
                await deleteAvatar();
                onImageSelected(null);
                onClose();
              } catch (error) {
                console.error("Fehler beim Entfernen des Avatars:", error);
                Alert.alert(
                  t('avatarPicker.alerts.removeError.title'),
                  t('avatarPicker.alerts.removeError.message')
                );
              } finally {
                setIsLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error("Fehler beim Entfernen des Avatars:", error);
      setIsLoading(false);
    }
  };

  // Render the tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "default":
        return (
          <DefaultAvatars
            currentAvatarUri={currentAvatarUri}
            onImageSelected={onImageSelected}
            onLoading={setIsLoading}
            onClose={onClose}
          />
        );

      case "gallery":
        return (
          <View style={styles.optionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: pressed
                    ? theme.isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)"
                    : theme.isDark
                    ? "rgba(255,255,255,0.01)"
                    : "rgba(0,0,0,0.01)",
                },
              ]}
              onPress={pickImage}
              disabled={isLoading}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: theme.isDark
                      ? "rgba(66, 133, 244, 0.2)"
                      : "rgba(66, 133, 244, 0.1)",
                  },
                ]}
              >
                <Feather name="image" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                {t('avatarPicker.options.chooseFromGallery')}
              </Text>
            </Pressable>
          </View>
        );

      case "camera":
        return (
          <View style={styles.optionsContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.option,
                {
                  backgroundColor: pressed
                    ? theme.isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)"
                    : theme.isDark
                    ? "rgba(255,255,255,0.01)"
                    : "rgba(0,0,0,0.01)",
                },
              ]}
              onPress={takePhoto}
              disabled={isLoading}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: theme.isDark
                      ? "rgba(66, 133, 244, 0.2)"
                      : "rgba(66, 133, 244, 0.1)",
                  },
                ]}
              >
                <Feather name="camera" size={24} color={colors.primary} />
              </View>
              <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                {t('avatarPicker.options.takePhoto')}
              </Text>
            </Pressable>
          </View>
        );

      default:
        return null;
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={[styles.modalBackdrop, { backgroundColor: "rgba(0,0,0,0.65)" }]}
      >
        <BlurView
          intensity={25}
          tint={theme.isDark ? "dark" : "light"}
          style={styles.modalOverlay}
        >
          <View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.isDark ? colors.card : colors.background,
                paddingBottom: insets.bottom + 16,
              },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                {t('avatarPicker.title')}
              </Text>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Feather name="x" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Current Avatar Preview */}
            {previewUri && (
              <View style={styles.previewContainer}>
                <Image source={previewUri} style={styles.previewImage} />

                {/* Remove button */}
                <Pressable
                  style={({ pressed }) => [
                    {
                      opacity: pressed ? 0.8 : 1,
                      backgroundColor: theme.isDark
                        ? "rgba(244, 67, 54, 0.2)"
                        : "rgba(244, 67, 54, 0.1)",
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 18,
                      flexDirection: "row",
                      alignItems: "center",
                    },
                  ]}
                  onPress={removeCurrentAvatar}
                  disabled={isLoading}
                >
                  <Feather
                    name="trash-2"
                    size={16}
                    color="#F44336"
                    style={{ marginRight: 6 }}
                  />
                  <Text style={{ color: "#F44336", fontWeight: "600" }}>
                    {t('avatarPicker.alerts.removeAvatar.remove')}
                  </Text>
                </Pressable>
              </View>
            )}

            {/* Tab Navigation */}
            <View
              style={[
                styles.tabContainer,
                {
                  backgroundColor: theme.isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.03)",
                },
              ]}
            >
              {/* Default Avatars Tab */}
              <Pressable
                style={[
                  styles.tabButton,
                  activeTab === "default" && {
                    backgroundColor: theme.isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => setActiveTab("default")}
                onLayout={(event) => measureTab("default", event)}
              >
                <Feather
                  name="grid"
                  size={18}
                  color={
                    activeTab === "default"
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    {
                      color:
                        activeTab === "default"
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {t('avatarPicker.tabs.avatars')}
                </Text>
              </Pressable>

              {/* Gallery Tab */}
              <Pressable
                style={[
                  styles.tabButton,
                  activeTab === "gallery" && {
                    backgroundColor: theme.isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => setActiveTab("gallery")}
                onLayout={(event) => measureTab("gallery", event)}
              >
                <Feather
                  name="image"
                  size={18}
                  color={
                    activeTab === "gallery"
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    {
                      color:
                        activeTab === "gallery"
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {t('avatarPicker.tabs.gallery')}
                </Text>
              </Pressable>

              {/* Camera Tab */}
              <Pressable
                style={[
                  styles.tabButton,
                  activeTab === "camera" && {
                    backgroundColor: theme.isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(0,0,0,0.05)",
                  },
                ]}
                onPress={() => setActiveTab("camera")}
                onLayout={(event) => measureTab("camera", event)}
              >
                <Feather
                  name="camera"
                  size={18}
                  color={
                    activeTab === "camera"
                      ? colors.primary
                      : colors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.tabButtonText,
                    {
                      color:
                        activeTab === "camera"
                          ? colors.primary
                          : colors.textSecondary,
                    },
                  ]}
                >
                  {t('avatarPicker.tabs.camera')}
                </Text>
              </Pressable>

              {/* Active Tab Indicator */}
              <Animated.View
                style={[
                  styles.activeTabIndicator,
                  { backgroundColor: colors.primary },
                  tabIndicatorStyle,
                ]}
              />
            </View>

            {/* Tab Content */}
            {renderTabContent()}

            {/* Loading Indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
              </View>
            )}
          </View>
        </BlurView>
      </View>
    </Modal>
  );
};

export default AvatarPicker;
