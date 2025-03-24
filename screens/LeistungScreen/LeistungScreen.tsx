// screens/LeistungScreen/LeistungScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StatisticsDisplay from "@/screens/LeistungScreen/components/StatisticsDisplay/StatisticsDisplay";
import { loadStats, GameStats } from "@/utils/storage";
import { Feather } from "@expo/vector-icons";
import Header from "@/components/Header/Header";

const LeistungScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const loadedStats = await loadStats();
        setStats(loadedStats);
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme.isDark ? "light" : "dark"} hidden={true} />

      <View style={{ flex: 1 }}>
        <Header 
          title="Meine Leistung" 
          rightAction={{
            icon: "settings",
            onPress: () => router.push("/settings")
          }}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent, 
            { paddingBottom: Math.max(insets.bottom + 100, 120) }
          ]}
          showsVerticalScrollIndicator={false}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Feather name="loader" size={32} color={colors.primary} />
              <Text
                style={[styles.loadingText, { color: colors.textSecondary }]}
              >
                Statistiken werden geladen...
              </Text>
            </View>
          ) : stats ? (
            <StatisticsDisplay stats={stats} />
          ) : (
            <View style={styles.emptyStateContainer}>
              <Feather
                name="activity"
                size={64}
                color={colors.textSecondary}
                style={{ opacity: 0.5 }}
              />
              <Text
                style={[styles.emptyStateText, { color: colors.textSecondary }]}
              >
                Keine Statistiken verfügbar. Spiele ein paar Runden Sudoku, um
                deine Leistung zu verfolgen!
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    marginTop: 24,
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
});

export default LeistungScreen;