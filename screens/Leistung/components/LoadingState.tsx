// screens/LeistungScreen/components/LoadingState.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";
import { ProfileHeaderSkeleton, TabContentSkeleton } from "./skeletons";
import { SkeletonBox } from "@/components/Skeleton";

const LoadingState: React.FC = () => {
  return (
    <Animated.View
      style={styles.container}
      entering={FadeIn.duration(300)}
      accessibilityLabel="Inhalte werden geladen"
    >
      <ProfileHeaderSkeleton />

      {/* Tab Navigator Skeleton */}
      <View style={styles.tabNavigator}>
        <SkeletonBox width="23%" height={40} borderRadius={8} />
        <SkeletonBox width="23%" height={40} borderRadius={8} />
        <SkeletonBox width="23%" height={40} borderRadius={8} />
        <SkeletonBox width="23%" height={40} borderRadius={8} />
      </View>

      <TabContentSkeleton />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tabNavigator: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 12,
  },
});

export default LoadingState;