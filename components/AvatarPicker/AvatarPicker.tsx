// components/AvatarPicker/AvatarPicker.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { saveAvatar, deleteAvatar } from '@/utils/avatarStorage';
import { useTheme } from '@/utils/theme/ThemeProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

interface AvatarPickerProps {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string | null) => void;
  currentAvatarUri: string | null;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  visible,
  onClose,
  onImageSelected,
  currentAvatarUri
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);

  // Fotogalerie-Zugriff anfordern und ein Bild auswählen
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Zugriff benötigt',
          'Um ein Profilbild auszuwählen, benötigt die App Zugriff auf deine Fotobibliothek.',
          [{ text: 'OK' }]
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
      console.error('Fehler beim Auswählen des Bildes:', error);
      Alert.alert('Fehler', 'Das Bild konnte nicht ausgewählt werden. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  // Kamera öffnen und ein Foto aufnehmen
  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Zugriff benötigt',
          'Um ein Foto aufzunehmen, benötigt die App Zugriff auf deine Kamera.',
          [{ text: 'OK' }]
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
      console.error('Fehler beim Aufnehmen des Fotos:', error);
      Alert.alert('Fehler', 'Das Foto konnte nicht aufgenommen werden. Bitte versuche es erneut.');
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
      console.error('Fehler bei der Bildverarbeitung:', error);
      throw error;
    }
  };

  // Aktuelles Profilbild entfernen
  const removeCurrentAvatar = async () => {
    try {
      setIsLoading(true);
      
      // Bestätigungsdialog anzeigen
      Alert.alert(
        'Profilbild entfernen',
        'Möchtest du dein aktuelles Profilbild wirklich entfernen?',
        [
          { text: 'Abbrechen', style: 'cancel' },
          {
            text: 'Entfernen',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteAvatar();
                onImageSelected(null);
                onClose();
              } catch (error) {
                console.error('Fehler beim Entfernen des Avatars:', error);
                Alert.alert('Fehler', 'Das Profilbild konnte nicht entfernt werden.');
              } finally {
                setIsLoading(false);
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Fehler beim Entfernen des Avatars:', error);
      setIsLoading(false);
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
      <View style={[
          styles.modalBackdrop,
          {backgroundColor: 'rgba(0,0,0,0.65)'}
        ]}>
        <BlurView 
          intensity={25} 
          tint={theme.isDark ? 'dark' : 'light'} 
          style={styles.modalOverlay}
        >
          <View style={[
            styles.modalContainer,
            {
              backgroundColor: theme.isDark ? colors.card : colors.background,
              paddingBottom: insets.bottom + 16
            }
          ]}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Profilbild ändern
              </Text>
              <Pressable 
                onPress={onClose}
                style={({ pressed }) => [
                  styles.closeButton,
                  { opacity: pressed ? 0.7 : 1 }
                ]}
              >
                <Feather name="x" size={24} color={colors.textSecondary} />
              </Pressable>
            </View>

            {/* Current Avatar Preview */}
            {currentAvatarUri && (
              <View style={styles.previewContainer}>
                <Image 
                  source={{ uri: currentAvatarUri }} 
                  style={styles.previewImage} 
                />
              </View>
            )}

            {/* Options */}
            <View style={styles.optionsContainer}>
              {/* Gallery Option */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: pressed 
                      ? theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                      : theme.isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)'
                  }
                ]}
                onPress={pickImage}
                disabled={isLoading}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: theme.isDark ? 'rgba(66, 133, 244, 0.2)' : 'rgba(66, 133, 244, 0.1)' }
                ]}>
                  <Feather name="image" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                  Aus Galerie wählen
                </Text>
              </Pressable>

              {/* Camera Option */}
              <Pressable
                style={({ pressed }) => [
                  styles.option,
                  {
                    backgroundColor: pressed 
                      ? theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                      : theme.isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)'
                  }
                ]}
                onPress={takePhoto}
                disabled={isLoading}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: theme.isDark ? 'rgba(66, 133, 244, 0.2)' : 'rgba(66, 133, 244, 0.1)' }
                ]}>
                  <Feather name="camera" size={24} color={colors.primary} />
                </View>
                <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                  Foto aufnehmen
                </Text>
              </Pressable>

              {/* Remove Option (only if there's a current avatar) */}
              {currentAvatarUri && (
                <Pressable
                  style={({ pressed }) => [
                    styles.option,
                    {
                      backgroundColor: pressed 
                        ? theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
                        : theme.isDark ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)'
                    }
                  ]}
                  onPress={removeCurrentAvatar}
                  disabled={isLoading}
                >
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: theme.isDark ? 'rgba(244, 67, 54, 0.2)' : 'rgba(244, 67, 54, 0.1)' }
                  ]}>
                    <Feather name="trash-2" size={24} color="#F44336" />
                  </View>
                  <Text style={[styles.optionText, { color: colors.textPrimary }]}>
                    Profilbild entfernen
                  </Text>
                </Pressable>
              )}
            </View>

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

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  previewImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  optionsContainer: {
    marginBottom: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});

export default AvatarPicker;