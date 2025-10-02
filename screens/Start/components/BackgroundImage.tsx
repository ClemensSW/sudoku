import React from "react";
import { View, ImageBackground } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";
import { styles } from "../Start.styles";

interface BackgroundImageProps {
  backgroundImage: Landscape | null;
  useFullQuality: boolean;
  backgroundHeight: number;
  insets: { top: number; bottom: number; left: number; right: number };
}

export const BackgroundImage: React.FC<BackgroundImageProps> = ({
  backgroundImage,
  useFullQuality,
  backgroundHeight,
  insets,
}) => {
  return (
    <View style={[styles.backgroundContainer, { height: backgroundHeight }]}>
      {backgroundImage ? (
        <Animated.View style={{ flex: 1 }} entering={FadeIn.duration(120)}>
          <ImageBackground
            source={useFullQuality ? backgroundImage.fullSource : backgroundImage.previewSource}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={[styles.safeArea, { paddingTop: insets.top }]} />
          </ImageBackground>
        </Animated.View>
      ) : (
        // Neutral placeholder to avoid any fallback image flash on cold start
        <View style={styles.backgroundImage} />
      )}
    </View>
  );
};
