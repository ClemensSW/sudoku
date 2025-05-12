// components/AvatarPicker/AvatarOption.tsx
import React from 'react';
import { View, Image, Text, Pressable } from 'react-native';
import { DefaultAvatar } from '@/utils/defaultAvatars';
import { useTheme } from '@/utils/theme/ThemeProvider';
import styles from './styles';

interface AvatarOptionProps {
  avatar: DefaultAvatar;
  isSelected: boolean;
  onSelect: (avatar: DefaultAvatar) => void;
  isNew?: boolean;
}

const AvatarOption: React.FC<AvatarOptionProps> = ({
  avatar,
  isSelected,
  onSelect,
  isNew = false
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  return (
    <View>
      <Pressable
        style={({ pressed }) => [
          styles.avatarOption,
          {
            opacity: pressed ? 0.8 : 1,
            backgroundColor: theme.isDark ? colors.surface : colors.background,
          },
          isSelected && [
            styles.avatarSelected,
            { borderColor: colors.primary }
          ]
        ]}
        onPress={() => onSelect(avatar)}
      >
        <Image
          source={avatar.source}
          style={styles.avatarImage}
          resizeMode="cover"
        />
        
        {isNew && (
          <View style={styles.newBadge}>
            <Text style={styles.newBadgeText}>!</Text>
          </View>
        )}
      </Pressable>
      <Text 
        style={[
          styles.avatarName, 
          { color: colors.textSecondary }
        ]}
        numberOfLines={1}
      >
        {avatar.name}
      </Text>
    </View>
  );
};

export default AvatarOption;