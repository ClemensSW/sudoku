// screens/Settings/components/SettingsCategoryList/SettingsCategoryList.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";

interface Category {
  id: string;
  titleKey: string;
  icon: keyof typeof Feather.glyphMap;
  route: string;
  showOnlyInGame?: boolean;
}

interface SettingsCategoryListProps {
  showGameFeatures: boolean;
}

const SettingsCategoryList: React.FC<SettingsCategoryListProps> = ({
  showGameFeatures,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();

  // Define all categories
  const allCategories: Category[] = [
    {
      id: "profile",
      titleKey: "categories.profile",
      icon: "user",
      route: "/settings/profile",
    },
    {
      id: "design",
      titleKey: "categories.design",
      icon: "sun",
      route: "/settings/design",
    },
    {
      id: "game",
      titleKey: "categories.game",
      icon: "sliders",
      route: "/settings/game",
    },
    {
      id: "help",
      titleKey: "categories.help",
      icon: "help-circle",
      route: "/settings/help",
    },
    {
      id: "community",
      titleKey: "categories.community",
      icon: "users",
      route: "/settings/community",
    },
    {
      id: "info",
      titleKey: "categories.info",
      icon: "info",
      route: "/settings/info",
    },
  ];

  const handleCategoryPress = (route: string) => {
    triggerHaptic("light");
    router.push(route as any);
  };

  // Sort categories based on context (in-game vs normal)
  const getSortedCategories = () => {
    if (showGameFeatures) {
      // Im Spiel: Spiel > Profil > Anzeige > Community > Info
      // (Hilfe+Actions inline above, Profil navigable)
      const order = ["game", "profile", "design", "community", "info"];
      return order
        .map((id) => allCategories.find((cat) => cat.id === id))
        .filter((cat): cat is Category => cat !== undefined);
    } else {
      // Normal: Anzeige > Spiel > Hilfe > Community > Info
      // (Profil inline above, Hilfe navigable)
      const order = ["design", "game", "help", "community", "info"];
      return order
        .map((id) => allCategories.find((cat) => cat.id === id))
        .filter((cat): cat is Category => cat !== undefined);
    }
  };

  const visibleCategories = getSortedCategories();

  return (
    <View style={styles.container}>
      {visibleCategories.map((category, index) => (
        <Animated.View
          key={category.id}
          entering={FadeInDown.delay(index * 50).duration(400)}
        >
          <TouchableOpacity
            style={[
              styles.categoryItem,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
            onPress={() => handleCategoryPress(category.route)}
            activeOpacity={0.7}
          >
            <View style={styles.leftContent}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: colors.background },
                ]}
              >
                <Feather
                  name={category.icon}
                  size={24}
                  color={colors.textSecondary}
                />
              </View>
              <Text style={[styles.categoryTitle, { color: colors.textPrimary }]}>
                {t(category.titleKey)}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </Animated.View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
});

export default SettingsCategoryList;
