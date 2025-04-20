// screens/LeistungScreen/LeistungScreen.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { loadStats, GameStats } from "@/utils/storage";
import Header from "@/components/Header/Header";
import LoadingState from "./components/LoadingState";
import EmptyState from "./components/EmptyState";
import LevelProgress from "@/components/GameCompletionModal/components/LevelProgress/LevelProgress";
import StreakDisplay from "@/components/GameCompletionModal/components/StreakDisplay/StreakDisplay";
import BestTimesChart from "./components/BestTimesChart/BestTimesChart";
// Import PuzzleProgress component and useLandscapes hook
import { PuzzleProgress } from "@/components/LandscapeCollection";
import { useLandscapes } from "@/hooks/useLandscapes";

const LeistungScreen: React.FC = () => {
  const router = useRouter();
  const theme = useTheme();
  const colors = theme.colors;
  const insets = useSafeAreaInsets();
  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Add the useLandscapes hook to get the current landscape
  const { currentLandscape } = useLandscapes();

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
  
  // Handler for "View Gallery" button
  const handleViewGallery = () => {
    router.push("/gallery");
  };

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
            <LoadingState />
          ) : stats ? (
            <>
              {/* Level Progress */}
              <LevelProgress 
                stats={stats}
                difficulty="medium" // Standard value as there's no current game
                justCompleted={false} // No recently completed game
              />
              <View style={styles.sectionSpacer} />
              
              {/* Add PuzzleProgress component */}
              {currentLandscape && (
                <>
                  <PuzzleProgress 
                    landscape={currentLandscape}
                    onViewGallery={handleViewGallery}
                  />
                  <View style={styles.sectionSpacer} />
                </>
              )}
              
              {/* Streak Display - always show */}
              <StreakDisplay 
                currentStreak={stats.currentStreak}
                longestStreak={stats.longestStreak}
                isRecord={stats.currentStreak === stats.longestStreak && stats.longestStreak > 2}
              />
              <View style={styles.sectionSpacer} />
              
              {/* Best Times Chart */}
              <BestTimesChart stats={stats} />
            </>
          ) : (
            <EmptyState />
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
  sectionSpacer: {
    height: 16,
  },
});

export default LeistungScreen;