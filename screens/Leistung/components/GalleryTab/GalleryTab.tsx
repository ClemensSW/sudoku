// screens/LeistungScreen/components/GalleryTab/GalleryTab.tsx
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/utils/theme/ThemeProvider";
import { useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";
import { PuzzleProgress } from "@/screens/Gallery/components/LandscapeCollection";
import { useLandscapes } from "@/screens/Gallery/hooks/useLandscapes";

const GalleryTab: React.FC = () => {
  const theme = useTheme();
  const colors = theme.colors;
  const router = useRouter();
  const isFocused = useIsFocused();

  // Use the useLandscapes hook to get the current landscape
  const { currentLandscape, isLoading, reload } = useLandscapes("completed");

  // Reload when screen is focused to get the latest current project
  useEffect(() => {
    if (isFocused) {
      reload();
    }
  }, [isFocused, reload]);

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
      ) : (
        <View style={styles.contentContainer}>
          {/* Current landscape progress - PuzzleProgress already has navigation capability */}
          {currentLandscape && (
            <PuzzleProgress
              landscape={currentLandscape}
              onViewGallery={handleViewGallery}
            />
          )}
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
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 32,
  }
});

export default GalleryTab;