// screens/LeistungScreen/components/ProfileHeader/ProfileHeader.tsx
import React, { useState, useRef } from "react";
import { View, Text, Image, StyleSheet, Pressable, TextInput, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { GameStats } from "@/utils/storage";
import AvatarPicker from "../AvatarPicker";
import { getAvatarSourceFromUri, DEFAULT_AVATAR } from "../../utils/defaultAvatars";
import HikingIcon from "@/assets/svg/hiking.svg";
import LightningIcon from "@/assets/svg/lightning.svg";

interface ProfileHeaderProps {
  stats: GameStats;
  name: string;
  avatarUri?: string | null;
  onChangeName?: (name: string) => void;
  onChangeAvatar?: (uri: string | null) => void;
  completedLandscapesCount: number;

  /** NEU: Ausgewählter Titel (optional) */
  title?: string | null;
  /** Callback wenn auf Titel geklickt wird */
  onTitlePress?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  stats,
  name,
  avatarUri,
  onChangeName,
  onChangeAvatar,
  completedLandscapesCount,
  title = null,
  onTitlePress,
}) => {
  const { t } = useTranslation("leistung");
  const theme = useTheme();
  const colors = theme.colors;

  // Name
  const isDefaultName = !name || name === "User" || name === "Jerome";
  const [isEditingName, setIsEditingName] = useState(isDefaultName);
  const [editedName, setEditedName] = useState(isDefaultName ? "" : name);
  const inputRef = useRef<TextInput>(null);

  // Avatar
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const getAvatarSource = () => getAvatarSourceFromUri(avatarUri, DEFAULT_AVATAR);

  const handleNameEdit = () => {
    if (isEditingName && onChangeName && editedName.trim()) onChangeName(editedName.trim());
    setIsEditingName(!isEditingName);
  };
  const openAvatarPicker = () => setShowAvatarPicker(true);
  const closeAvatarPicker = () => setShowAvatarPicker(false);
  const handleAvatarChange = (uri: string | null) => onChangeAvatar?.(uri);

  // Ruhige Farben aus Theme
  const cardBg = theme.isDark ? "rgba(255,255,255,0.04)" : "#FFFFFF";
  const cardBorder = theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const iconCircleBg = theme.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const dividerColor = theme.isDark ? "rgba(255,255,255,0.20)" : "rgba(0,0,0,0.15)";
  const valueColor = theme.isDark ? "#FFFFFF" : colors.textPrimary;
  const labelColor = theme.isDark ? "rgba(255,255,255,0.85)" : colors.textSecondary;
  const descriptionColor = theme.isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)";
  const titleBg = theme.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.05)";
  const titleBorder = theme.isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.08)";

  // Elevation-Fix (Android Dark Mode)
  const androidElevation = Platform.OS === "android" ? (theme.isDark ? 0 : 3) : 0;

  const formatNumber = (n: number) => new Intl.NumberFormat("de-DE").format(n);

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Pressable
        onPress={openAvatarPicker}
        style={[
          styles.avatarContainer,
          { backgroundColor: theme.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" },
        ]}
      >
        <Image source={getAvatarSource()} style={styles.avatar} />
        <View style={styles.avatarOverlay}>
          <Feather name="camera" size={20} color="#fff" />
        </View>
      </Pressable>

      {/* Name + (optional) Titel als Pill darunter */}
      <View style={styles.nameContainer}>
        {isEditingName ? (
          <Pressable onPress={() => inputRef.current?.focus()}>
            <TextInput
              ref={inputRef}
              style={[styles.nameInput, { color: colors.textPrimary, borderColor: colors.primary }]}
              value={editedName}
              onChangeText={setEditedName}
              onBlur={handleNameEdit}
              onSubmitEditing={handleNameEdit}
              placeholder={t("profile.namePlaceholder")}
              placeholderTextColor={colors.textSecondary}
              returnKeyType="done"
            />
          </Pressable>
        ) : (
          <Pressable onPress={() => setIsEditingName(true)}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{isDefaultName ? "" : name}</Text>
          </Pressable>
        )}

        {title && (
          <Pressable
            onPress={onTitlePress}
            style={({ pressed }) => [
              styles.titlePill,
              {
                backgroundColor: theme.isDark ? titleBg : '#FFFFFF',
                borderColor: titleBorder,
                opacity: pressed ? 0.7 : 1,
              }
            ]}
          >
            <Feather name="award" size={16} color={colors.primary} />
            <Text style={[styles.titlePillText, { color: theme.isDark ? "#fff" : "#111" }]} numberOfLines={1}>
              {title}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Stats Card – strukturiert & ruhig */}
      <View
        style={[
          styles.statsCard,
          {
            backgroundColor: cardBg,
            borderColor: cardBorder,
            shadowOpacity: theme.isDark ? 0.18 : 0.08, // iOS shadow
            elevation: androidElevation, // Android: Light=3, Dark=0
          },
          Platform.OS === "android" && theme.isDark ? { borderWidth: StyleSheet.hairlineWidth } : null,
        ]}
      >
        {/* pseudo-3D Hairlines nur für Android Dark */}
        {Platform.OS === "android" && theme.isDark && (
          <>
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 8,
                right: 8,
                height: 1,
                backgroundColor: "rgba(255,255,255,0.06)",
                borderRadius: 1,
              }}
            />
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 8,
                right: 8,
                height: 1,
                backgroundColor: "rgba(0,0,0,0.22)",
                borderRadius: 1,
              }}
            />
          </>
        )}

        <View style={styles.statsRow}>
          <StatTile
            customIcon={<HikingIcon width={40} height={40} />}
            value={formatNumber(stats.totalXP)}
            label={t("profile.xp")}
            description={t("profile.xpDescription")}
            colors={{
              icon: colors.primary,
              valueColor: valueColor,
              label: labelColor,
              desc: descriptionColor,
            }}
          />
          <HairlineDivider color={dividerColor} />
          <StatTile
            customIcon={<LightningIcon width={40} height={40} />}
            value={formatNumber(stats.longestStreak)}
            label={t("profile.streak")}
            description={t("profile.streakDescription")}
            colors={{
              icon: colors.primary,
              valueColor: valueColor,
              label: labelColor,
              desc: descriptionColor,
            }}
          />
          <HairlineDivider color={dividerColor} />
          <StatTile
            customIcon={<Image source={require("@/assets/png/picture.png")} style={{ width: 40, height: 40 }} />}
            value={formatNumber(completedLandscapesCount)}
            label={completedLandscapesCount === 1 ? t("profile.picture") : t("profile.pictures")}
            description={t("profile.picturesDescription")}
            colors={{
              icon: colors.primary,
              valueColor: valueColor,
              label: labelColor,
              desc: descriptionColor,
            }}
          />
        </View>
      </View>

      {/* Avatar Picker */}
      <AvatarPicker
        visible={showAvatarPicker}
        onClose={closeAvatarPicker}
        onImageSelected={handleAvatarChange}
        currentAvatarUri={avatarUri ?? null}
      />
    </View>
  );
};

/* ---------- Subcomponents ---------- */

const HairlineDivider = ({ color }: { color: string }) => <View style={[styles.divider, { backgroundColor: color }]} />;

const StatTile = ({
  customIcon,
  value,
  label,
  description,
  colors,
}: {
  customIcon: React.ReactNode;
  value: string | number;
  label: string;
  description: string;
  colors: { icon: string; valueColor: string; label: string; desc: string };
}) => {
  const scale = useSharedValue(1);
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 100, easing: Easing.out(Easing.quad) }) }],
  }));

  return (
    <Pressable
      onPressIn={() => (scale.value = 0.985)}
      onPressOut={() => (scale.value = 1)}
      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
      style={styles.statPressable}
    >
      <Animated.View style={[styles.statItem, rStyle]}>
        <View style={styles.iconContainer}>
          {customIcon}
        </View>
        <Text
          style={[styles.statValue, { color: colors.valueColor }, Platform.OS === "ios" ? { fontVariant: ["tabular-nums"] } : null]}
        >
          {value}
        </Text>
        <Text style={[styles.statLabel, { color: colors.label }]}>{label}</Text>
        <Text style={[styles.statDescription, { color: colors.desc }]}>{description}</Text>
      </Animated.View>
    </Pressable>
  );
};

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 28,
  },

  /* Avatar */
  avatarContainer: {
    position: "relative",
    marginBottom: 12,
    borderRadius: 70,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
  },
  avatar: { width: 180, height: 180, borderRadius: 60, backgroundColor: "#F8E4D9" },
  avatarOverlay: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  /* Name + Titel */
  nameContainer: { marginBottom: 40, alignItems: "center" },
  name: { fontSize: 24, fontWeight: "700" },
  nameInput: {
    fontSize: 24,
    fontWeight: "700",
    borderBottomWidth: 1,
    paddingHorizontal: 4,
    paddingVertical: 2,
    minWidth: 140,
    textAlign: "center",
  },
  titlePill: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1.5,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  titlePillText: {
    fontSize: 15,
    fontWeight: "700",
    maxWidth: 280,
    letterSpacing: 0.4,
  },

  /* Stats Card */
  statsCard: {
    width: "100%",
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    paddingVertical: 20,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    marginVertical: 8,
  },

  statPressable: { flex: 1 },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 2,
    letterSpacing: 0.2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 12,
    fontWeight: "400",
    opacity: 0.9,
  },
});

export default ProfileHeader;
