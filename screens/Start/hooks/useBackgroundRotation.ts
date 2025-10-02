import { useState, useEffect, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Asset } from "expo-asset";
import { getCurrentFavoriteBackground, getNextFavoriteBackground } from "@/screens/Gallery/utils/landscapes/storage";
import { Landscape } from "@/screens/Gallery/utils/landscapes/types";

// Persist across mounts for instant first frame
let preparedNextGlobal: Landscape | null = null;
let lastShownGlobal: Landscape | null = null;

export const useBackgroundRotation = () => {
  const [backgroundImage, setBackgroundImage] = useState<Landscape | null>(null);
  const [useFullQuality, setUseFullQuality] = useState(false);
  const hasFocusedOnce = useRef(false);

  // Focus/Blur: show prepared image instantly; prepare next on blur
  useFocusEffect(
    useCallback(() => {
      // Only run on focus, not on every render
      (async () => {
        try {
          let imageToShow: Landscape | null = null;

          if (preparedNextGlobal) {
            // Use the prepared next image (already preloaded)
            imageToShow = preparedNextGlobal;
            preparedNextGlobal = null;

            // Show immediately without waiting
            setBackgroundImage(imageToShow);
            setUseFullQuality(true); // Already preloaded, use full quality
            lastShownGlobal = imageToShow;
          } else {
            // Get next image in rotation
            imageToShow = await getNextFavoriteBackground();

            if (imageToShow) {
              // Show preview immediately (no await - let it load in background)
              setBackgroundImage(imageToShow);
              setUseFullQuality(false);
              lastShownGlobal = imageToShow;

              // Load full quality in background without blocking
              Asset.fromModule(imageToShow.fullSource).downloadAsync()
                .then(() => setUseFullQuality(true))
                .catch(() => {});
            }
          }
        } catch (e) {
          console.error("Error loading background on focus:", e);
        }
      })();

      return () => {
        (async () => {
          try {
            const next = await getNextFavoriteBackground();
            if (next) {
              try {
                // Preload both preview and full quality for instant display next time
                // @ts-ignore require-Module
                await Asset.fromModule(next.previewSource).downloadAsync();
                // @ts-ignore require-Module
                await Asset.fromModule(next.fullSource).downloadAsync();
              } catch {}
              preparedNextGlobal = next;
            }
          } catch (e) {
            console.error("Error preparing next background on blur:", e);
          }
        })();
      };
    }, []) // Empty dependency array - only run on focus/blur, not on state changes
  );


  return { backgroundImage, useFullQuality };
};
