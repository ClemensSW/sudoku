// screens/Settings/components/SettingsCategoryList/SettingsCategoryList.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { triggerHaptic } from "@/utils/haptics";

interface Category {
  id: string;
  titleKey: string;
  icon: keyof typeof Feather.glyphMap;
  showOnlyInGame?: boolean;
}

interface SettingsCategoryListProps {
  showGameFeatures: boolean;
  onDesignPress: () => void;
  onGamePress: () => void;
  onHelpPress: () => void;
  onCommunityPress: () => void;
  onAccountDataPress: () => void;
  onInfoPress: () => void;
}

const SettingsCategoryList: React.FC<SettingsCategoryListProps> = ({
  showGameFeatures,
  onDesignPress,
  onGamePress,
  onHelpPress,
  onCommunityPress,
  onAccountDataPress,
  onInfoPress,
}) => {
  const { t } = useTranslation("settings");
  const theme = useTheme();
  const colors = theme.colors;

  // Define all categories
  const allCategories: Category[] = [
    {
      id: "design",
      titleKey: "categories.design",
      icon: "sun",
    },
    {
      id: "game",
      titleKey: "categories.game",
      icon: "sliders",
    },
    {
      id: "help",
      titleKey: "categories.help",
      icon: "help-circle",
    },
    {
      id: "community",
      titleKey: "categories.community",
      icon: "users",
    },
    {
      id: "accountData",
      titleKey: "categories.accountData",
      icon: "shield",
    },
    {
      id: "info",
      titleKey: "categories.info",
      icon: "info",
    },
  ];

  const handleCategoryPress = (categoryId: string) => {
    triggerHaptic("light");
    switch (categoryId) {
      case "design":
        onDesignPress();
        break;
      case "game":
        onGamePress();
        break;
      case "help":
        onHelpPress();
        break;
      case "community":
        onCommunityPress();
        break;
      case "accountData":
        onAccountDataPress();
        break;
      case "info":
        onInfoPress();
        break;
    }
  };

  // Sort categories based on context (in-game vs normal)
  const getSortedCategories = () => {
    if (showGameFeatures) {
      // Im Spiel: Spiel > Profil > Anzeige > Community > Konto & Daten > Info
      // (Hilfe+Actions inline above)
      const order = ["game", "profile", "design", "community", "accountData", "info"];
      return order
        .map((id) => allCategories.find((cat) => cat.id === id))
        .filter((cat): cat is Category => cat !== undefined);
    } else {
      // Normal: Anzeige > Spiel > Hilfe > Community > Konto & Daten > Info
      // (Profil inline above)
      const order = ["design", "game", "help", "community", "accountData", "info"];
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
            onPress={() => handleCategoryPress(category.id)}
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
