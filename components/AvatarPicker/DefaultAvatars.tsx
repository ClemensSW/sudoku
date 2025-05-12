// components/AvatarPicker/DefaultAvatars.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import AvatarOption from './AvatarOption';
import { DefaultAvatar, getAvatarsByCategory, getDefaultAvatarPath } from '@/utils/defaultAvatars';
import { saveDefaultAvatar } from '@/utils/avatarStorage';
import styles from './styles';

interface DefaultAvatarsProps {
  currentAvatarUri: string | null;
  onImageSelected: (uri: string) => void;
  onLoading: (isLoading: boolean) => void;
  onClose: () => void; // Neue Prop hinzugefügt
}

const DefaultAvatars: React.FC<DefaultAvatarsProps> = ({
  currentAvatarUri,
  onImageSelected,
  onLoading,
  onClose
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const categorizedAvatars = getAvatarsByCategory();
  
  // Set initial selected avatar if it matches a default avatar
  useEffect(() => {
    if (currentAvatarUri?.startsWith('default://')) {
      setSelectedAvatar(currentAvatarUri.replace('default://', ''));
    }
  }, [currentAvatarUri]);
  
  const handleSelectAvatar = async (avatar: DefaultAvatar) => {
    try {
      setIsLoading(true);
      onLoading(true);
      
      // Save the default avatar reference
      const avatarPath = await saveDefaultAvatar(avatar.id);
      
      // Update selection
      setSelectedAvatar(avatar.id);
      
      // Notify parent component
      onImageSelected(avatarPath);
      
      // Kurze Verzögerung, damit der Nutzer die Auswahl sieht
      setTimeout(() => {
        // Diese Zeile fehlte - wir müssen das onClose vom übergeordneten AvatarPicker aufrufen
        onClose();
      }, 300);
    } catch (error) {
      console.error('Error selecting default avatar:', error);
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };
  
  return (
    <ScrollView
      style={{ maxHeight: 400 }}
      showsVerticalScrollIndicator={true}
    >
      <View style={styles.gridContainer}>
        {Object.entries(categorizedAvatars).map(([category, avatars]) => (
          <View key={category}>
            <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>
              {category}
            </Text>
            <View style={styles.gridRow}>
              {avatars.map((avatar) => (
                <AvatarOption
                  key={avatar.id}
                  avatar={avatar}
                  isSelected={selectedAvatar === avatar.id}
                  onSelect={handleSelectAvatar}
                  isNew={avatar.id === 'avatar8'} // Als Beispiel, kann auf Basis realer Daten angepasst werden
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default DefaultAvatars;