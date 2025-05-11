// screens/LeistungScreen/components/GalleryTab/GalleryTab.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";
import { PuzzleProgress } from "@/screens/GalleryScreen/components/LandscapeCollection";
import { useLandscapes } from "@/screens/GalleryScreen/hooks/useLandscapes";

const GalleryTab: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  
  // Use the useLandscapes hook to get the current landscape
  const { landscapes, currentLandscape, isLoading } = useLandscapes("completed");
  
  // Navigate to gallery screen
  const handleViewGallery = () => {
    router.push("/gallery");
  };

  return (
    <Animated.View 
      style={styles.container}
      entering={FadeIn.duration(300)}
    >
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Feather name="loader" size={24} color={colors.primary} />
        </View>
      ) : currentLandscape ? (
        <View style={styles.contentContainer}>
          {/* Current landscape progress */}
          <PuzzleProgress
            landscape={currentLandscape}
            onViewGallery={handleViewGallery}
          />
          
          {/* View all button */}
          <TouchableOpacity
            style={[styles.viewAllButton, { backgroundColor: colors.primary }]}
            onPress={handleViewGallery}
          >
            <Feather name="grid" size={16} color="#FFFFFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>
              Alle Bilder ({landscapes.length}) anzeigen
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Feather name="image" size={48} color={colors.textSecondary} style={{ opacity: 0.5 }} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Noch keine Bilder gesammelt. Löse Sudokus, um wunderschöne Landschaftsbilder freizuschalten!
          </Text>
          <TouchableOpacity
            style={[styles.viewAllButton, { backgroundColor: colors.primary }]}
            onPress={handleViewGallery}
          >
            <Text style={styles.buttonText}>Sammlung entdecken</Text>
          </TouchableOpacity>
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  contentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
});

export default GalleryTab;