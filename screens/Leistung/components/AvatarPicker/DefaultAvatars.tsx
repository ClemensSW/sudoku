// components/AvatarPicker/DefaultAvatars.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import AvatarOption from './AvatarOption';
import { DefaultAvatar, getAvatarsByCategory, getDefaultAvatarPath, defaultAvatars } from '../../utils/defaultAvatars';
import { saveDefaultAvatar } from '../../utils/avatarStorage';
import styles from './styles';

export type AvatarCategory = 'Cartoon' | 'Anime' | 'Tiere';

interface DefaultAvatarsProps {
  currentAvatarUri: string | null;
  onImageSelected: (uri: string) => void;
  onLoading: (isLoading: boolean) => void;
  onClose: () => void;
  activeCategory: AvatarCategory;
}

const DefaultAvatars: React.FC<DefaultAvatarsProps> = ({
  currentAvatarUri,
  onImageSelected,
  onLoading,
  onClose,
  activeCategory
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get default avatar (always shown)
  const defaultAvatar = defaultAvatars.find(a => a.id === 'default');

  // Filter avatars by active category
  const filteredAvatars = defaultAvatars.filter(avatar => {
    if (avatar.id === 'default') return false; // Exclude default, will be shown separately
    return avatar.category === activeCategory;
  });
  
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
      
      // Short delay to let the user see the selection
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (error) {
      console.error('Error selecting default avatar:', error);
    } finally {
      setIsLoading(false);
      onLoading(false);
    }
  };

  // Combine default avatar with filtered avatars
  const avatarsToShow = defaultAvatar ? [defaultAvatar, ...filteredAvatars] : filteredAvatars;

  if (avatarsToShow.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={{ color: colors.textSecondary }}>
          Keine Avatare verfügbar
        </Text>
      </View>
    );
  }

  // Directly using ScrollView with windowing optimization
  return (
    <ScrollView
      style={{ maxHeight: 400 }}
      showsVerticalScrollIndicator={true}
      contentContainerStyle={styles.gridContainer}
      removeClippedSubviews={true} // Optimization
    >
      <View style={styles.gridRow}>
        {avatarsToShow.map((avatar) => (
          <AvatarOption
            key={avatar.id}
            avatar={avatar}
            isSelected={selectedAvatar === avatar.id}
            onSelect={handleSelectAvatar}
            isNew={false}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default DefaultAvatars;