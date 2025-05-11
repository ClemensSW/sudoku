// screens/LeistungScreen/components/ProfileHeader/ProfileHeader.tsx
import React, { useState } from "react";
import { View, Text, Image, StyleSheet, Pressable, TextInput } from "react-native";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { GameStats } from "@/utils/storage";

interface ProfileHeaderProps {
  stats: GameStats;
  name: string;
  onChangeName?: (name: string) => void;
  onChangeAvatar?: () => void;
  completedLandscapesCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  stats,
  name,
  onChangeName,
  onChangeAvatar,
  completedLandscapesCount,
}) => {
  const theme = useTheme();
  const colors = theme.colors;
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(name);

  // Get current level from stats
  const currentLevel = stats.totalXP > 0 ? Math.floor(stats.totalXP / 30) + 1 : 1;

  // Create light color variants for backgrounds
  const infoLight = theme.isDark 
    ? `${colors.info}30` // 30% opacity in dark mode
    : `${colors.info}15`; // 15% opacity in light mode
    
  const warningLight = theme.isDark 
    ? `${colors.warning}30` 
    : `${colors.warning}15`;
    
  const successLight = theme.isDark 
    ? `${colors.success}30` 
    : `${colors.success}15`;
    
  // Create tertiary text color
  const textTertiary = theme.isDark 
    ? 'rgba(255,255,255,0.5)' 
    : 'rgba(0,0,0,0.5)';

  const handleNameEdit = () => {
    if (isEditingName) {
      // Save name
      if (onChangeName && editedName.trim()) {
        onChangeName(editedName.trim());
      }
    }
    setIsEditingName(!isEditingName);
  };

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: colors.surface }]}
      entering={FadeIn.duration(400)}
    >
      {/* Profile Picture */}
      <Pressable 
        style={styles.avatarContainer} 
        onPress={onChangeAvatar}
      >
        <Image
          source={require("@/assets/images/avatars/default.png")}
          style={styles.avatar}
        />
        <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
          <Feather name="edit-2" size={12} color="#FFFFFF" />
        </View>
      </Pressable>

      {/* User Name */}
      <View style={styles.nameContainer}>
        {isEditingName ? (
          <TextInput
            style={[styles.nameInput, { color: colors.textPrimary, borderColor: colors.primary }]}
            value={editedName}
            onChangeText={setEditedName}
            autoFocus
            onBlur={handleNameEdit}
            onSubmitEditing={handleNameEdit}
          />
        ) : (
          <Pressable onPress={() => setIsEditingName(true)}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>
              {name}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Stats Highlights */}
      <View style={styles.statsContainer}>
        {/* Level */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: infoLight }]}>
            <Feather name="flag" size={18} color={colors.info} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {currentLevel}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Level Ups
          </Text>
          <Text style={[styles.statDescription, { color: textTertiary }]}>
            Deine Reise
          </Text>
        </View>

        {/* Streak */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: warningLight }]}>
            <Feather name="zap" size={18} color={colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {stats.longestStreak}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            In Serie
          </Text>
          <Text style={[styles.statDescription, { color: textTertiary }]}>
            Dein Rekord
          </Text>
        </View>

        {/* Images */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: successLight }]}>
            <Feather name="image" size={18} color={colors.success} />
          </View>
          <Text style={[styles.statValue, { color: colors.textPrimary }]}>
            {completedLandscapesCount}
          </Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
            Bilder gesammelt
          </Text>
          <Text style={[styles.statDescription, { color: textTertiary }]}>
            Schöne Gallery
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  nameContainer: {
    marginBottom: 20,
    flexDirection: "row",
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
    minWidth: 100,
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 12,
    fontWeight: "400",
  },
});

export default ProfileHeader;