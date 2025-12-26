// screens/LeistungScreen/components/ProfileHeader/ProfileHeader.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, Pressable, TextInput, Platform } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";
import { GameStats } from "@/utils/storage";
import AvatarPicker from "../AvatarPicker";
import { getAvatarSourceFromUri, DEFAULT_AVATAR } from "../../utils/defaultAvatars";
import LeistungIcon from "@/assets/svg/leistung.svg";
import LightningIcon from "@/assets/svg/lightning.svg";
import { useProgressColor } from "@/hooks/useProgressColor";
import { useLevelInfo } from "@/screens/GameCompletion/components/PlayerProgressionCard/utils/useLevelInfo";

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

  /** Callbacks für Stats Card Navigation */
  onXPPress?: () => void;
  onPicturesPress?: () => void;
  onStreakPress?: () => void;
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
  onXPPress,
  onPicturesPress,
  onStreakPress,
}) => {
  const { t } = useTranslation("leistung");
  const theme = useTheme();
  const colors = theme.colors;
  const progressColor = useProgressColor();
  const levelInfo = useLevelInfo(stats.totalXP);

  // Name
  const isDefaultName = !name || name === "User" || name === "Jerome";
  const [isEditingName, setIsEditingName] = useState(isDefaultName);
  const [editedName, setEditedName] = useState(isDefaultName ? "" : name);
  const inputRef = useRef<TextInput>(null);

  // Synchronize editedName with name prop when it changes (fixes immediate display bug)
  useEffect(() => {
    if (!isEditingName) {
      setEditedName(isDefaultName ? "" : name);
    }
  }, [name, isDefaultName, isEditingName]);

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
  const cardBg = theme.isDark ? colors.surface : "#FFFFFF";
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
      </Pressable>

      {/* Name + (optional) Titel als Pill darunter */}
      <View style={styles.nameContainer}>
        {isEditingName ? (
          <Pressable onPress={() => inputRef.current?.focus()}>
            <TextInput
              ref={inputRef}
              style={[styles.nameInput, { color: colors.textPrimary, borderColor: progressColor }]}
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
              styles.titleText,
              { opacity: pressed ? 0.6 : 1 }
            ]}
          >
            <Feather name="award" size={14} color={colors.textSecondary} style={{ marginRight: 6 }} />
            <Text style={[styles.titleTextStyle, { color: colors.textSecondary }]} numberOfLines={1}>
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
          },
        ]}
      >

        <View style={styles.statsRow}>
          <StatTile
            customIcon={<LeistungIcon width={40} height={40} />}
            value={levelInfo.currentLevel + 1}
            label={t("profile.xp")}
            description={t("profile.xpDescription")}
            colors={{
              icon: colors.primary,
              valueColor: valueColor,
              label: labelColor,
              desc: descriptionColor,
            }}
            onPress={onXPPress}
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
            onPress={onPicturesPress}
          />
          <HairlineDivider color={dividerColor} />
          <StatTile
            customIcon={<LightningIcon width={40} height={40} />}
            value={formatNumber(stats.dailyStreak?.currentStreak ?? 0)}
            label={(stats.dailyStreak?.currentStreak ?? 0) === 1 ? "Tag" : "Tage"}
            description={t("profile.dailyStreakDescription", { defaultValue: "Deine Serie" })}
            colors={{
              icon: colors.primary,
              valueColor: valueColor,
              label: labelColor,
              desc: descriptionColor,
            }}
            onPress={onStreakPress}
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
  onPress,
}: {
  customIcon: React.ReactNode;
  value: string | number;
  label: string;
  description: string;
  colors: { icon: string; valueColor: string; label: string; desc: string };
  onPress?: () => void;
}) => {
  const scale = useSharedValue(1);
  const rStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 100, easing: Easing.out(Easing.quad) }) }],
  }));

  return (
    <Pressable
      onPress={onPress}
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
  },
  avatar: { width: 180, height: 180, borderRadius: 60, backgroundColor: "#F8E4D9" },

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
  titleText: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  titleTextStyle: {
    fontSize: 15,
    fontWeight: "500",
    maxWidth: 280,
    textAlign: "center",
  },

  /* Stats Card */
  statsCard: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 20,
    paddingHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
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
