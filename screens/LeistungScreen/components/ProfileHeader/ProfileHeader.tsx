// screens/LeistungScreen/components/ProfileHeader/ProfileHeader.tsx
import React, { useState, useRef } from "react";
import { View, Text, Image, StyleSheet, Pressable, TextInput } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { GameStats } from "@/utils/storage";
import AvatarPicker from "@/components/AvatarPicker";
import { isDefaultAvatarPath, getAvatarIdFromPath, getAvatarById, getAvatarSourceFromUri, DEFAULT_AVATAR } from '@/utils/defaultAvatars';

interface ProfileHeaderProps {
  stats: GameStats;
  name: string;
  avatarUri?: string | null;
  onChangeName?: (name: string) => void;
  onChangeAvatar?: (uri: string | null) => void;
  completedLandscapesCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  stats,
  name,
  avatarUri,
  onChangeName,
  onChangeAvatar,
  completedLandscapesCount,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  
  // Zustandsvariablen
  const isDefaultName = !name || name === "User" || name === "Jerome";
  const [isEditingName, setIsEditingName] = useState(isDefaultName);
  const [editedName, setEditedName] = useState(isDefaultName ? "" : name);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  
  // Referenz zum TextInput
  const inputRef = useRef<TextInput>(null);
  
  // Styles und Farben
  const statsBackgroundColor = theme.isDark
    ? 'rgba(66, 133, 244, 0.12)'
    : 'rgba(219, 234, 254, 0.9)';
  
  const valueColor = theme.isDark ? '#FFFFFF' : colors.textPrimary;
  const labelColor = theme.isDark ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary;
  const descriptionColor = theme.isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  const iconColor = theme.isDark ? colors.primary : colors.primary;
  const iconBgColor = theme.isDark 
    ? 'rgba(66, 133, 244, 0.2)' 
    : 'rgba(66, 133, 244, 0.1)';

  // Name bearbeiten
  const handleNameEdit = () => {
    if (isEditingName) {
      // Name speichern
      if (onChangeName && editedName.trim()) {
        onChangeName(editedName.trim());
      }
    }
    setIsEditingName(!isEditingName);
  };

  // Avatar-Picker öffnen/schließen
  const openAvatarPicker = () => {
    setShowAvatarPicker(true);
  };

  const closeAvatarPicker = () => {
    setShowAvatarPicker(false);
  };

  // Avatar-Änderungen verarbeiten
  const handleAvatarChange = (uri: string | null) => {
    if (onChangeAvatar) {
      onChangeAvatar(uri);
    }
  };
  
  // Avatar-Quelle ermitteln
  const getAvatarSource = () => {
    return getAvatarSourceFromUri(avatarUri, DEFAULT_AVATAR);
  };

  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(400)}
    >
      {/* Profile Picture */}
      <Pressable 
        style={[
          styles.avatarContainer,
          { backgroundColor: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)' }
        ]}
        onPress={openAvatarPicker}
      >
        <Image
          source={getAvatarSource()}
          style={styles.avatar}
          resizeMode="cover"
        />
        <View style={styles.avatarOverlay}>
          <Feather name="camera" size={20} color="#FFFFFF" />
        </View>
      </Pressable>

      {/* User Name */}
      <View style={styles.nameContainer}>
        {isEditingName ? (
          <Pressable onPress={() => inputRef.current?.focus()}>
            <TextInput
              ref={inputRef}
              style={[
                styles.nameInput, 
                { color: colors.textPrimary, borderColor: colors.primary }
              ]}
              value={editedName}
              onChangeText={setEditedName}
              onBlur={handleNameEdit}
              onSubmitEditing={handleNameEdit}
              placeholder="Dein Name"
              placeholderTextColor={colors.textSecondary}
            />
          </Pressable>
        ) : (
          <Pressable 
            onPress={() => setIsEditingName(true)}
            style={styles.nameContainer}
          >
            <Text 
              style={[
                styles.name, 
                { color: colors.textPrimary }
              ]}
            >
              {isDefaultName ? "" : name}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Stats Section */}
      <View
        style={[
          styles.statsContainer,
          { backgroundColor: statsBackgroundColor }
        ]}
      >
        {/* Experience Points */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <Feather name="flag" size={20} color={iconColor} />
          </View>
          <Text style={[styles.statValue, { color: valueColor }]}>
            {stats.totalXP}
          </Text>
          <Text style={[styles.statLabel, { color: labelColor }]}>
            EP
          </Text>
          <Text style={[styles.statDescription, { color: descriptionColor }]}>
            Deine Reise
          </Text>
        </View>

        {/* Streak */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <Feather name="zap" size={20} color={iconColor} />
          </View>
          <Text style={[styles.statValue, { color: valueColor }]}>
            {stats.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: labelColor }]}>
            In Serie
          </Text>
          <Text style={[styles.statDescription, { color: descriptionColor }]}>
            Dein Rekord
          </Text>
        </View>

        {/* Images */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <Feather name="image" size={20} color={iconColor} />
          </View>
          <Text style={[styles.statValue, { color: valueColor }]}>
            {completedLandscapesCount}
          </Text>
          <Text style={[styles.statLabel, { color: labelColor }]}>
            {completedLandscapesCount === 1 ? "Bild" : "Bilder"}
          </Text>
          <Text style={[styles.statDescription, { color: descriptionColor }]}>
            Schöne Galerie
          </Text>
        </View>
      </View>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        visible={showAvatarPicker}
        onClose={closeAvatarPicker}
        onImageSelected={handleAvatarChange}
        currentAvatarUri={avatarUri ?? null}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 32,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    borderRadius: 70,
    padding: 4,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  avatarOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameContainer: {
    marginBottom: 24,
    alignItems: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
  },
  nameInput: {
    fontSize: 24,
    fontWeight: "700",
    borderBottomWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 140,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 3,
  },
  statDescription: {
    fontSize: 12,
    fontWeight: "400",
  },
});

export default ProfileHeader;