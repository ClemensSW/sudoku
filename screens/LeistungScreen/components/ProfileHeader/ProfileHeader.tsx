// screens/LeistungScreen/components/ProfileHeader/ProfileHeader.tsx
import React, { useState, useEffect } from "react";
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
  // Check if name is empty or a default name like "User" or "Jerome"
  const isDefaultName = !name || name === "User" || name === "Jerome";
  const [isEditingName, setIsEditingName] = useState(isDefaultName);
  const [editedName, setEditedName] = useState(isDefaultName ? "" : name);

  // Get current level from stats
  const currentLevel = stats.totalXP > 0 ? Math.floor(stats.totalXP / 30) + 1 : 1;
  
  // Stats container background color
  const statsBackgroundColor = theme.isDark
    ? 'rgba(66, 133, 244, 0.12)'
    : 'rgba(219, 234, 254, 0.9)';
  
  // Determine text colors with proper contrast
  const valueColor = theme.isDark ? '#FFFFFF' : colors.textPrimary;
  const labelColor = theme.isDark ? 'rgba(255, 255, 255, 0.8)' : colors.textSecondary;
  const descriptionColor = theme.isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)';
  
  // Icon colors
  const iconColor = theme.isDark ? colors.primary : colors.primary;
  
  // Icon backgrounds
  const iconBgColor = theme.isDark 
    ? 'rgba(66, 133, 244, 0.2)' 
    : 'rgba(66, 133, 244, 0.1)';

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
      style={styles.container}
      entering={FadeIn.duration(400)}
    >
      {/* Profile Picture */}
      <Pressable 
        style={[
  styles.avatarContainer,
  { backgroundColor: descriptionColor }
]}
        onPress={onChangeAvatar}
      >
        <Image
          source={require("@/assets/images/avatars/default.webp")}
          style={styles.avatar}
        />
      </Pressable>

      {/* User Name */}
      <View style={styles.nameContainer}>
        {isEditingName ? (
          <TextInput
            style={[
              styles.nameInput, 
              { color: colors.textPrimary, borderColor: colors.primary }
            ]}
            value={editedName}
            onChangeText={setEditedName}
            autoFocus
            onBlur={handleNameEdit}
            onSubmitEditing={handleNameEdit}
            placeholder="Dein Name"
            placeholderTextColor={colors.textSecondary}
          />
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

      {/* Stats Section - With styled background */}
      <View
        style={[
          styles.statsContainer,
          { backgroundColor: statsBackgroundColor }
        ]}
      >
        {/* Level */}
        <View style={styles.statItem}>
          <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
            <Feather name="flag" size={20} color={iconColor} />
          </View>
          <Text style={[styles.statValue, { color: valueColor }]}>
            {currentLevel}
          </Text>
          <Text style={[styles.statLabel, { color: labelColor }]}>
            Level Ups
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
            Bilder
          </Text>
          <Text style={[styles.statDescription, { color: descriptionColor }]}>
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
    paddingVertical: 32,
  },
  avatarContainer: {
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
    borderRadius: 70,
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