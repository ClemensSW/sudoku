// components/AvatarPicker/DefaultAvatars.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useTheme } from '@/utils/theme/ThemeProvider';
import AvatarOption from './AvatarOption';
import { DefaultAvatar, defaultAvatars } from '../../utils/defaultAvatars';
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

  // Filter avatars by active category - memoized for performance
  const avatarsToShow = useMemo(() => {
    return defaultAvatars.filter(avatar => avatar.category === activeCategory);
  }, [activeCategory]);

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

  // Render item for FlatList
  const renderItem = ({ item }: { item: DefaultAvatar }) => (
    <View style={styles.avatarWrapper}>
      <AvatarOption
        avatar={item}
        isSelected={selectedAvatar === item.id}
        onSelect={handleSelectAvatar}
        isNew={false}
      />
    </View>
  );

  // Key extractor
  const keyExtractor = (item: DefaultAvatar) => item.id;

  if (avatarsToShow.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={{ color: colors.textSecondary }}>
          Keine Avatare verfügbar
        </Text>
      </View>
    );
  }

  // Using FlatList for optimal performance with large lists
  return (
    <FlatList
      data={avatarsToShow}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={3}
      contentContainerStyle={styles.gridContainer}
      showsVerticalScrollIndicator={true}
      removeClippedSubviews={true}
      maxToRenderPerBatch={15}
      initialNumToRender={15}
      windowSize={10}
      getItemLayout={(data, index) => ({
        length: 120, // Approximate item height
        offset: 120 * Math.floor(index / 3),
        index,
      })}
    />
  );
};

export default DefaultAvatars;