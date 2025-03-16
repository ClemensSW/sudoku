// app/leistung.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import StatisticsDisplay from "@/components/StatisticsDisplay/StatisticsDisplay";
import { loadStats, GameStats } from "@/utils/storage";
import { Feather } from "@expo/vector-icons";

export default function LeistungScreen() {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
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

      <SafeAreaView style={styles.safeArea}>
        <Animated.View style={styles.header} entering={FadeIn.duration(400)}>
          <View style={styles.headerContent}>
            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
              Meine Leistung
            </Text>

            <TouchableOpacity
              style={[styles.iconButton, { backgroundColor: colors.surface }]}
              onPress={() => router.push("/settings")}
            >
              <Feather name="settings" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    zIndex: 10,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    paddingBottom: 120, // Extra space for bottom navigation
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
