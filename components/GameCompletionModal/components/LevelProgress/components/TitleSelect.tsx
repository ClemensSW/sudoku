// components/GameCompletionModal/components/LevelProgress/components/TitleSelect.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import styles from "../LevelProgress.styles";

type Props = {
  titles: string[];
  selected: string | null;
  onSelect: (title: string | null) => void;
  color: string;
  isDark: boolean;
};

const TitleSelect: React.FC<Props> = ({ titles, selected, onSelect, color, isDark }) => {
  const theme = useTheme();
  const colors = theme.colors;

  const labelColor = colors.textSecondary; // gut lesbar in Dark & Light
  const clearColor = colors.textSecondary;

  return (
    <Animated.View entering={FadeIn.duration(160)}>
      <View style={styles.titleHeaderRow}>
        <Text
          style={[
            styles.titleHeaderLabel,
            { color: labelColor, opacity: 1 }, // <-- explizit volle Opazität
          ]}
        >
          Titel auswählen
        </Text>

        <Pressable
          onPress={() => onSelect(null)}
          style={({ pressed }) => [
            styles.titleClearBtn,
            {
              backgroundColor: pressed
                ? isDark
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.06)"
                : "transparent",
            },
          ]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Titel zurücksetzen"
        >
          <Feather name="slash" size={14} color={clearColor} />
          <Text
            style={[
              styles.titleClearText,
              { color: clearColor, opacity: 1 }, // <-- explizit volle Opazität
            ]}
          >
            Ohne Titel
          </Text>
        </Pressable>
      </View>

      <View style={styles.titleChipsWrap}>
        {titles.map((t) => {
          const isSel = selected === t;
          return (
            <Pressable
              key={t}
              onPress={() => onSelect(t)}
              style={({ pressed }) => [
                styles.titleChip,
                {
                  backgroundColor: isSel
                    ? color
                    : isDark
                    ? "rgba(255,255,255,0.06)"
                    : "rgba(0,0,0,0.04)",
                  borderColor: isSel
                    ? "transparent"
                    : isDark
                    ? "rgba(255,255,255,0.12)"
                    : "rgba(0,0,0,0.08)",
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
              accessibilityRole="button"
              accessibilityState={{ selected: isSel }}
            >
              <Text
                style={[
                  styles.titleChipText,
                  { color: isSel ? "#fff" : isDark ? "#fff" : "#111" },
                ]}
                numberOfLines={1}
              >
                {t}
              </Text>
              {isSel && <Feather name="check" size={14} color="#fff" />}
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default TitleSelect;
