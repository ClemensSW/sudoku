// screens/DuoScreen/DuoScreen.tsx
import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import styles from "./DuoScreen.styles";

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
  iconColor: string;
  iconBgColor: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
  iconColor,
  iconBgColor,
}) => {
  const theme = useTheme();
  const colors = theme.colors;

  return (
    <View style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: iconBgColor }]}>
        <Feather name={icon as any} size={20} color={iconColor} />
      </View>
      <View style={styles.featureContent}>
        <Text style={[styles.featureTitle, { color: colors.textPrimary }]}>
          {title}
        </Text>
        <Text
          style={[styles.featureDescription, { color: colors.textSecondary }]}
        >
          {description}
        </Text>
      </View>
    </View>
  );
};

// Simple grid component to represent a Sudoku board
const SudokuGrid: React.FC = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
    >
      {[...Array(9)].map((_, rowIndex) =>
        [...Array(9)].map((_, colIndex) => (
          <View
            key={`cell-${rowIndex}-${colIndex}`}
            style={{
              width: "11.11%",
              height: "11.11%",
              borderWidth: 0.5,
              borderColor: "rgba(255,255,255,0.2)",
              backgroundColor:
                rowIndex % 3 === 1 && colIndex % 3 === 1
                  ? "rgba(255,255,255,0.1)"
                  : "transparent",
            }}
          />
        ))
      )}
    </View>
  );
};

const DuoScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();

  // Handler for settings button
  const handleSettingsPress = () => {
    router.push("/settings");
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        {/* Settings Icon in Top Right */}
        <View style={[styles.header, { top: insets.top + 16 }]}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              {
                backgroundColor: colors.surface,
                borderWidth: 0,
              },
            ]}
            onPress={handleSettingsPress}
          >
            <Feather name="settings" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 56 + insets.bottom }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Title Section */}
            <View style={styles.titleContainer}>
              <View
                style={[
                  styles.titlePill,
                  { backgroundColor: `${colors.primary}20` },
                ]}
              >
                <Text
                  style={[styles.comingSoonText, { color: colors.primary }]}
                >
                  Coming Soon
                </Text>
              </View>
              <Text style={[styles.title, { color: colors.textPrimary }]}>
                Sudoku Duo-Modus
              </Text>
              <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                Fordere deine Freunde heraus oder spielt zusammen in Echtzeit
              </Text>
            </View>

            {/* Game Visualizer */}
            <View style={styles.gameVisualizer}>
              <View
                style={[
                  styles.boardContainer,
                  { backgroundColor: colors.card },
                ]}
              >
                {/* Top Player Area */}
                <View
                  style={[
                    styles.boardTop,
                    { backgroundColor: `${colors.primary}50` },
                  ]}
                >
                  <View style={styles.playerContainer}>
                    <View style={styles.playerInfo}>
                      <View
                        style={[
                          styles.playerAvatar,
                          { backgroundColor: colors.primary },
                        ]}
                      >
                        <Feather name="user" size={20} color="white" />
                      </View>
                      <Text
                        style={[
                          styles.playerName,
                          { color: colors.textPrimary },
                        ]}
                      >
                        Spieler 1
                      </Text>
                      <Text
                        style={[
                          styles.playerScore,
                          { color: colors.textSecondary },
                        ]}
                      >
                        7/40 Zellen
                      </Text>
                    </View>
                  </View>
                  <View style={styles.sudokuCells}>
                    <SudokuGrid />
                  </View>
                </View>

                {/* Bottom Player Area */}
                <View
                  style={[
                    styles.boardBottom,
                    { backgroundColor: `${colors.secondary}30` },
                  ]}
                >
                  <View style={styles.playerContainer}>
                    <View style={styles.playerInfo}>
                      <View
                        style={[
                          styles.playerAvatar,
                          { backgroundColor: colors.secondary },
                        ]}
                      >
                        <Feather name="user" size={20} color="white" />
                      </View>
                      <Text
                        style={[
                          styles.playerName,
                          { color: colors.textPrimary },
                        ]}
                      >
                        Spieler 2
                      </Text>
                      <Text
                        style={[
                          styles.playerScore,
                          { color: colors.textSecondary },
                        ]}
                      >
                        5/40 Zellen
                      </Text>
                    </View>
                  </View>
                  <View style={styles.sudokuCells}>
                    <SudokuGrid />
                  </View>
                </View>

                {/* VS Divider */}
                <View
                  style={[styles.divider, { backgroundColor: colors.border }]}
                />
                <View
                  style={[
                    styles.versusContainer,
                    {
                      backgroundColor: colors.surface,
                      borderWidth: 2,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[styles.versusText, { color: colors.textPrimary }]}
                  >
                    VS
                  </Text>
                </View>
              </View>
            </View>

            {/* Feature List */}
            <View style={styles.featureList}>
              <FeatureItem
                icon="zap"
                title="Wettkampfmodus"
                description="Einer spielt die obere Hälfte, einer die untere Hälfte. Wer zuerst fertig ist, gewinnt."
                iconColor={colors.warning}
                iconBgColor={`${colors.warning}20`}
              />
              <FeatureItem
                icon="clock"
                title="Echtzeit"
                description="Spielt gleichzeitig am selben Sudoku und seht die Fortschritte in Echtzeit."
                iconColor={colors.success}
                iconBgColor={`${colors.success}20`}
              />
              <FeatureItem
                icon="award"
                title="Bestenlisten"
                description="Trete in Bestenlisten an und verbessere deine Platzierung mit jedem Sieg."
                iconColor={colors.primary}
                iconBgColor={`${colors.primary}20`}
              />
            </View>

            {/* CTA Section */}
            <View style={styles.ctaContainer}>
              <TouchableOpacity
                style={[styles.ctaButton, { backgroundColor: colors.primary }]}
              >
                <Feather name="bell" size={20} color="white" />
                <Text
                  style={[styles.ctaButtonText, { color: colors.buttonText }]}
                >
                  Benachrichtigen, wenn verfügbar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default DuoScreen;
